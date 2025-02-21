import datetime
from flask import Flask, request, jsonify, send_file
from psycopg2 import errors  
import psycopg2
import base64
import io
from reportlab.lib.pagesizes import mm
from reportlab.pdfgen import canvas
from decimal import Decimal
from flask_jwt_extended import JWTManager, create_access_token
import jwt
from flask_cors import CORS
import bcrypt
import re
from datetime import datetime
from psycopg2.extras import RealDictCursor


app = Flask(__name__)
CORS(app) # 🔹 Permite requisições apenas do frontend
app.config["JWT_SECRET_KEY"] = "seu_segredo_aqui"
jwt = JWTManager(app)
SECRET_KEY = "seu_segredo_super_secreto"

# Configuração do banco de dados
DB_CONFIG = {
    "host": "127.0.0.1",
    "database": "tzsystem",
    "user": "postgres",
    "password": "senha1",
    "port": 5432
}

def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao banco: {e}")
        return None

# 🔹 Rota de Login do PDV por Código (id) e Senha
@app.route("/loginPDV", methods=["POST"])
def loginPDV():
    data = request.get_json()
    codigo = data.get("codigo")  # 🔹 Recebe o ID (Código do Operador)
    senha = data.get("senha")

    if not codigo or not senha:
        return jsonify({"error": "Código e senha são obrigatórios!"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco de dados!"}), 500

    try:
        with conn.cursor() as cur:
            # 🔹 Agora buscando também a filial_id
            cur.execute("SELECT id, nome, senha, cargo, filial_id FROM operadores WHERE id = %s AND ativo = TRUE", (codigo,))
            operador = cur.fetchone()

        if not operador:
            return jsonify({"error": "Operador não encontrado ou inativo!"}), 401

        operador_id, nome, senha_hash, cargo, filial_id = operador

        # 🔹 Verifica a senha criptografada (se armazenada com bcrypt)
        if not bcrypt.checkpw(senha.encode("utf-8"), senha_hash.encode("utf-8")):
            return jsonify({"error": "Senha incorreta!"}), 401

        # 🔹 Gera token JWT com filial_id incluído
        access_token = create_access_token(identity={"id": operador_id, "nome": nome, "cargo": cargo, "filial_id": filial_id})

        return jsonify({
            "message": "Login realizado com sucesso!",
            "operador": {
                "id": operador_id,
                "nome": nome,
                "cargo": cargo,
                "filial_id": filial_id  # 🔹 Retornando filial no JSON de resposta
            },
            "token": access_token
        }), 200
    finally:
        conn.close()
# ------------------------------
# 🚀 CRUD de Operadores
# ------------------------------
@app.route("/operadores", methods=["GET"])
def listar_operadores():
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("""
            SELECT o.id, o.nome, o.cpf, o.email, o.cargo, f.nome as filial 
            FROM operadores o 
            LEFT JOIN filiais f ON o.filial_id = f.id
            ORDER BY o.nome
        """)
        results = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
    
    conn.close()
    return jsonify([dict(zip(colnames, row)) for row in results])


@app.route("/operadores", methods=["POST"])
def criar_operador():
    data = request.get_json()
    print(data)
    
    if not all(k in data for k in ["nome", "cpf", "email", "senha", "cargo", "filial_id"]):
        return jsonify({"error": "Todos os campos são obrigatórios!"}), 400

    # 🔹 Criptografa a senha antes de salvar no banco
    senha_hash = bcrypt.hashpw(data["senha"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO operadores (nome, cpf, email, senha, cargo, filial_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (data["nome"], data["cpf"], data["email"], senha_hash, data["cargo"], data["filial_id"])
            )
            operador_id = cur.fetchone()[0]
            conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Erro ao cadastrar operador: {str(e)}"}), 500
    finally:
        conn.close()

    return jsonify({"message": "Operador criado com sucesso!", "id": operador_id}), 201

@app.route("/operadores/<int:id>", methods=["PUT"])
def atualizar_operador(id):
    data = request.get_json()
    
    conn = get_db_connection()
    with conn.cursor() as cur:
        if "senha" in data and data["senha"]:
            senha_hash = bcrypt.hashpw(data["senha"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            cur.execute(
                "UPDATE operadores SET nome=%s, cpf=%s, email=%s, senha=%s, cargo=%s, filial_id=%s WHERE id=%s",
                (data["nome"], data["cpf"], data["email"], senha_hash, data["cargo"], data["filial_id"], id)
            )
        else:
            cur.execute(
                "UPDATE operadores SET nome=%s, cpf=%s, email=%s, cargo=%s, filial_id=%s WHERE id=%s",
                (data["nome"], data["cpf"], data["email"], data["cargo"], data["filial_id"], id)
            )
        
        conn.commit()
    
    conn.close()
    return jsonify({"message": "Operador atualizado com sucesso!"})

# 📌 Endpoint de Login
@app.route("/login", methods=["POST"])
def loginUsers():
    data = request.get_json()

    if not data or not data.get("login") or not data.get("senha"):
        return jsonify({"error": "Nome ou email e senha são obrigatórios!"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # 🔹 Busca o usuário pelo nome OU email, agora incluindo `filial_id`
            cur.execute(
                "SELECT id, nome, email, senha, filial_id FROM usuarios WHERE email = %s OR nome = %s", 
                (data["login"], data["login"])
            )
            user = cur.fetchone()

            if not user:
                return jsonify({"error": "Usuário não encontrado!"}), 401

            user_id, nome, email, senha_hash, filial_id = user

            # 🔹 Verifica se a senha está corretamente hasheada
            if senha_hash is None:
                return jsonify({"error": "Senha não encontrada para este usuário. Contate o suporte."}), 401

            # 🔹 Verificação da senha com bcrypt
            if bcrypt.checkpw(data["senha"].encode("utf-8"), senha_hash.encode("utf-8")):
                # Criando token JWT
                token = create_access_token(identity={
                    "user_id": user_id, 
                    "nome": nome, 
                    "email": email,
                    "filial_id": filial_id  # ✅ Retornando a filial do usuário
                })
                
                return jsonify({
                    "message": "Login realizado com sucesso!", 
                    "token": token, 
                    "user": {
                        "id": user_id, 
                        "nome": nome, 
                        "email": email,
                        "filial_id": filial_id  # ✅ Incluído no retorno
                    }
                })
            else:
                return jsonify({"error": "Senha incorreta!"}), 401
    finally:
        conn.close()

        
@app.route("/operadores/<int:id>", methods=["DELETE"])
def deletar_operador(id):
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("DELETE FROM operadores WHERE id = %s", (id,))
        conn.commit()
    conn.close()
    return jsonify({"message": "Operador deletado!"})

@app.route("/usuarios", methods=["POST"])
def criar_usuario():
    try:
        data = request.get_json()
        print("📌 Dados Recebidos:", data)  # DEBUG

        # 🔹 Validação dos Campos
        required_fields = ["nome", "cpf", "email", "senha", "filial_id", "nivel_acesso_id"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({"error": "Todos os campos são obrigatórios!", "faltando": missing_fields}), 400

        # 🔹 Remover pontuação do CPF
        data["cpf"] = re.sub(r"\D", "", data["cpf"])

        # 🔹 Converter `filial_id` e `nivel_acesso_id` para inteiro
        try:
            filial_id = int(data["filial_id"])
            nivel_acesso_id = int(data["nivel_acesso_id"])
        except ValueError:
            return jsonify({"error": "Filial ID e Nível de Acesso devem ser números!"}), 400

        # 🔹 Hash da senha
        senha_hash = bcrypt.hashpw(data["senha"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Falha ao conectar ao banco de dados"}), 500

        try:
            with conn.cursor() as cur:
                # 🔹 Verificar se CPF já existe
                cur.execute("SELECT id FROM usuarios WHERE cpf = %s", (data["cpf"],))
                if cur.fetchone():
                    return jsonify({"error": "CPF já cadastrado!"}), 400

                # 🔹 Inserir usuário
                cur.execute(
                    """
                    INSERT INTO usuarios (nome, cpf, email, senha, filial_id, nivel_acesso_id) 
                    VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
                    """,
                    (data["nome"], data["cpf"], data["email"], senha_hash, filial_id, nivel_acesso_id)
                )
                usuario_id = cur.fetchone()[0]
                conn.commit()

        except Exception as e:
            conn.rollback()
            print(f"❌ Erro no banco de dados: {str(e)}")  # DEBUG NO TERMINAL
            return jsonify({"error": f"Erro ao cadastrar usuário: {str(e)}"}), 500
        finally:
            conn.close()

        return jsonify({"message": "Usuário criado com sucesso!", "id": usuario_id}), 201

    except Exception as e:
        print(f"❌ Erro inesperado: {str(e)}")  # DEBUG NO TERMINAL
        return jsonify({"error": f"Erro inesperado: {str(e)}"}), 500


# 📌 2️⃣ Buscar Usuários (GET)
@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT u.id, u.nome, u.cpf, u.email, f.nome AS filial, n.nivel
                FROM usuarios u
                LEFT JOIN filiais f ON u.filial_id = f.id
                LEFT JOIN niveis_acesso n ON u.nivel_acesso_id = n.id
                ORDER BY u.id
            """)
            usuarios = cur.fetchall()
            
            resultado = [
                {
                    "id": u[0], "nome": u[1], "cpf": u[2], "email": u[3],
                    "filial": u[4], "nivel_acesso": u[5]
                }
                for u in usuarios
            ]
    finally:
        conn.close()
    
    return jsonify(resultado), 200


# 📌 3️⃣ Buscar Usuário por ID (GET)
@app.route("/usuarios/<int:usuario_id>", methods=["GET"])
def obter_usuario(usuario_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT u.id, u.nome, u.cpf, u.email, u.cargo, f.nome AS filial, n.nivel
                FROM usuarios u
                LEFT JOIN filiais f ON u.filial_id = f.id
                LEFT JOIN niveis_acesso n ON u.nivel_acesso_id = n.id
                WHERE u.id = %s
            """, (usuario_id,))
            usuario = cur.fetchone()
            
            if usuario:
                resultado = {
                    "id": usuario[0], "nome": usuario[1], "cpf": usuario[2], 
                    "email": usuario[3], "cargo": usuario[4], 
                    "filial": usuario[5], "nivel_acesso": usuario[6]
                }
                return jsonify(resultado), 200
            else:
                return jsonify({"error": "Usuário não encontrado"}), 404
    finally:
        conn.close()


# 📌 4️⃣ Atualizar Usuário (PUT)
@app.route("/usuarios/<int:usuario_id>", methods=["PUT"])
def atualizar_usuario(usuario_id):
    data = request.get_json()

    campos_permitidos = ["nome", "cpf", "email", "senha", "cargo", "filial_id", "nivel_acesso_id"]
    campos_atualizar = {k: v for k, v in data.items() if k in campos_permitidos}

    if not campos_atualizar:
        return jsonify({"error": "Nenhum campo válido para atualização!"}), 400

    if "senha" in campos_atualizar:
        campos_atualizar["senha"] = bcrypt.hashpw(data["senha"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    set_clause = ", ".join(f"{k} = %s" for k in campos_atualizar.keys())

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE usuarios SET {set_clause} WHERE id = %s RETURNING id",
                (*campos_atualizar.values(), usuario_id)
            )
            if cur.rowcount == 0:
                return jsonify({"error": "Usuário não encontrado!"}), 404
            conn.commit()
    finally:
        conn.close()

    return jsonify({"message": "Usuário atualizado com sucesso!"}), 200


# 📌 5️⃣ Deletar Usuário (DELETE)
@app.route("/usuarios/<int:usuario_id>", methods=["DELETE"])
def deletar_usuario(usuario_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM usuarios WHERE id = %s RETURNING id", (usuario_id,))
            if cur.rowcount == 0:
                return jsonify({"error": "Usuário não encontrado!"}), 404
            conn.commit()
    finally:
        conn.close()

    return jsonify({"message": "Usuário deletado com sucesso!"}), 200

# ------------------------------
# 🚀 CRUD de Ofertas
# ------------------------------
@app.route("/ofertas", methods=["GET"])
def listar_ofertas():
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM ofertas ORDER BY data_inicio DESC")
        results = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
    conn.close()
    return jsonify([dict(zip(colnames, row)) for row in results])


@app.route("/ofertas", methods=["POST"])
def criar_oferta():
    data = request.get_json()
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("INSERT INTO ofertas (produto_id, tipo, valor, data_inicio, data_fim) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                    (data["produto_id"], data["tipo"], data["valor"], data["data_inicio"], data["data_fim"]))
        oferta_id = cur.fetchone()[0]
        conn.commit()
    conn.close()
    return jsonify({"message": "Oferta criada!", "id": oferta_id})


@app.route("/ofertas/<int:id>", methods=["PUT"])
def atualizar_oferta(id):
    data = request.get_json()
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("UPDATE ofertas SET tipo=%s, valor=%s, data_inicio=%s, data_fim=%s WHERE id=%s",
                    (data["tipo"], data["valor"], data["data_inicio"], data["data_fim"], id))
        conn.commit()
    conn.close()
    return jsonify({"message": "Oferta atualizada!"})


@app.route("/ofertas/<int:id>", methods=["DELETE"])
def cancelar_oferta(id):
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("DELETE FROM ofertas WHERE id = %s", (id,))
        conn.commit()
    conn.close()
    return jsonify({"message": "Oferta cancelada!"})

# ------------------------------
# 🚀 CRUD de Pedidos
# ------------------------------

@app.route("/pedidos_pendentes", methods=["GET"])
def listar_pedidos_pendentes():
    """Retorna a lista de pedidos pendentes ordenados pela data mais recente, filtrando por filial se necessário"""
    conn = get_db_connection()
    pedidos = {}

    # Obtendo o parâmetro da filial na query string (opcional)
    filial_id = request.args.get("filial_id")

    try:
        with conn.cursor() as cur:
            # Query base com possibilidade de filtro por filial
            query = """
                SELECT p.id, p.cliente, p.data_pedido, p.hora_pedido, p.status, p.total, p.taxa_entrega, p.observacao, p.filial_id,
                       pi.produto_id, prod.nome AS produto_nome, pi.quantidade, pi.preco_unitario, pi.total AS total_item
                FROM pedidos p
                LEFT JOIN pedido_itens pi ON p.id = pi.pedido_id
                LEFT JOIN produtos prod ON pi.produto_id = prod.id
                WHERE p.status = 'P'
            """
            params = []

            # Se filial_id for fornecido, filtra os pedidos dessa filial
            if filial_id:
                query += " AND p.filial_id = %s"
                params.append(filial_id)

            query += " ORDER BY p.data_pedido DESC, p.hora_pedido DESC"

            cur.execute(query, params)
            rows = cur.fetchall()
            colnames = [desc[0] for desc in cur.description]

            # Organizar pedidos e seus itens
            for row in rows:
                row_dict = dict(zip(colnames, row))
                pedido_id = row_dict.pop("id")

                if pedido_id not in pedidos:
                    pedidos[pedido_id] = {
                        "id": pedido_id,
                        "cliente": row_dict["cliente"],
                        "data_pedido": row_dict["data_pedido"].strftime('%Y-%m-%d'),  # ✅ Formata apenas a data
                        "hora_pedido": row_dict["hora_pedido"].strftime('%H:%M:%S'),  # ✅ Formata apenas a hora
                        "status": row_dict["status"],
                        "total": row_dict["total"],
                        "taxa_entrega": row_dict["taxa_entrega"],
                        "observacao": row_dict["observacao"],
                        "filial_id": row_dict["filial_id"],
                        "itens": []
                    }

                # Se o pedido tiver itens, adiciona na lista de itens
                if row_dict["produto_id"]:
                    pedidos[pedido_id]["itens"].append({
                        "produto_id": row_dict["produto_id"],
                        "produto_nome": row_dict["produto_nome"],
                        "quantidade": row_dict["quantidade"],
                        "preco_unitario": row_dict["preco_unitario"],
                        "total_item": row_dict["total_item"]
                    })

        return jsonify(list(pedidos.values()))

    except Exception as e:
        print(f"Erro ao listar pedidos: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()

@app.route("/pedidos", methods=["GET"])
def listar_pedidos():
    """Retorna a lista de pedidos ordenados pela data mais recente, incluindo os itens"""
    conn = get_db_connection()
    pedidos = {}

    try:
        with conn.cursor() as cur:
            # Buscar todos os pedidos
            cur.execute("""
                SELECT p.id, p.cliente, p.data_pedido, p.status, p.total, p.taxa_entrega, p.observacao,
                       pi.produto_id, prod.nome AS produto_nome, pi.quantidade, pi.preco_unitario, pi.total AS total_item
                FROM pedidos p
                LEFT JOIN pedido_itens pi ON p.id = pi.pedido_id
                LEFT JOIN produtos prod ON pi.produto_id = prod.id
                ORDER BY p.data_pedido DESC
            """)
            
            rows = cur.fetchall()
            colnames = [desc[0] for desc in cur.description]

            # Organizar pedidos e seus itens
            for row in rows:
                row_dict = dict(zip(colnames, row))
                pedido_id = row_dict.pop("id")

                if pedido_id not in pedidos:
                    pedidos[pedido_id] = {
                        "id": pedido_id,
                        "cliente": row_dict["cliente"],
                        "data_pedido": row_dict["data_pedido"],
                        "status": row_dict["status"],
                        "total": row_dict["total"],
                        "taxa_entrega": row_dict["taxa_entrega"],
                        "observacao": row_dict["observacao"],
                        "itens": []
                    }

                # Se o pedido tiver itens, adiciona na lista de itens
                if row_dict["produto_id"]:
                    pedidos[pedido_id]["itens"].append({
                        "produto_id": row_dict["produto_id"],
                        "produto_nome": row_dict["produto_nome"],
                        "quantidade": row_dict["quantidade"],
                        "preco_unitario": row_dict["preco_unitario"],
                        "total_item": row_dict["total_item"]
                    })

        return jsonify(list(pedidos.values()))

    except Exception as e:
        print(f"Erro ao listar pedidos: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()


@app.route("/pedidos", methods=["POST"])
def criar_pedido():
    """Cria um novo pedido e salva os itens"""
    data = request.get_json()

    # ✅ Validação: Garante que os campos essenciais estejam presentes
    required_fields = ["cliente", "total", "itens", "filial_id"]
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({"error": f"Campos obrigatórios ausentes: {', '.join(missing_fields)}"}), 400

    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            # 🔹 Insere o pedido na tabela `pedidos`
            cur.execute("""
                INSERT INTO pedidos (cliente, total, taxa_entrega, observacao, status, filial_id) 
                VALUES (%s, %s, %s, %s, 'P', %s) RETURNING id
            """, (
                data["cliente"], 
                float(data["total"]),  # ✅ Garante que é um número
                float(data.get("taxa_entrega", 0)),  # ✅ Valor padrão 0.00
                data.get("observacao", ""),
                int(data["filial_id"])  # ✅ Garante que é um número inteiro
            ))
            pedido_id = cur.fetchone()[0]  # Obtém o ID do pedido recém-criado

            # 🔹 Insere os itens do pedido
            for item in data["itens"]:
                cur.execute("""
                    INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario, total, filial_id)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    pedido_id,
                    int(item["produto_id"]),
                    float(item["quantidade"]),
                    float(item["preco_unitario"]),  # ✅ Conversão correta
                    float(item["total"]),
                    int(data["filial_id"])  # ✅ Inclui o `filial_id` nos itens também
                ))

            conn.commit()

        return jsonify({"message": "Pedido criado com sucesso!", "id": pedido_id, "status": "P"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()

@app.route("/pedidos/<int:id>", methods=["PUT"])
def atualizar_pedido(id):
    """Atualiza um pedido existente e seus itens apenas para a filial correspondente"""
    data = request.get_json()

    # ✅ Valida os campos obrigatórios
    required_fields = ["cliente", "total", "itens", "filial_id"]
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({"error": f"Campos obrigatórios ausentes: {', '.join(missing_fields)}"}), 400

    filial_id = int(data["filial_id"])  # ✅ Converte `filial_id` para inteiro

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # 🔹 Verifica se o pedido pertence à filial informada
            cur.execute("SELECT id FROM pedidos WHERE id = %s AND filial_id = %s", (id, filial_id))
            pedido_existente = cur.fetchone()
            if not pedido_existente:
                return jsonify({"error": "Pedido não encontrado ou não pertence à filial informada."}), 404

            # 🔹 Atualiza os detalhes do pedido na filial correspondente
            cur.execute("""
                UPDATE pedidos 
                SET cliente=%s, total=%s, taxa_entrega=%s, observacao=%s 
                WHERE id=%s AND filial_id=%s
            """, (
                data["cliente"], 
                float(data["total"]), 
                float(data.get("taxa_entrega", 0.00)), 
                data.get("observacao", ""), 
                id, 
                filial_id
            ))

            # 🔹 Lista os produtos atuais do pedido na filial correspondente
            cur.execute("""
                SELECT produto_id FROM pedido_itens 
                WHERE pedido_id = %s AND filial_id = %s
            """, (id, filial_id))
            produtos_atuais = {row[0] for row in cur.fetchall()}  # Converte para um conjunto

            novos_produtos = {item["produto_id"] for item in data["itens"]}  # Produtos que vêm da requisição

            # 🔹 Remover produtos que não estão mais na lista de itens
            produtos_removidos = produtos_atuais - novos_produtos
            if produtos_removidos:
                cur.execute("""
                    DELETE FROM pedido_itens 
                    WHERE pedido_id = %s AND filial_id = %s AND produto_id IN %s
                """, (id, filial_id, tuple(produtos_removidos)))

            # 🔹 Atualizar ou inserir os produtos no pedido
            for item in data["itens"]:
                if item["produto_id"] in produtos_atuais:
                    # Atualiza o item existente
                    cur.execute("""
                        UPDATE pedido_itens 
                        SET quantidade=%s, preco_unitario=%s, total=%s 
                        WHERE pedido_id=%s AND produto_id=%s AND filial_id=%s
                    """, (
                        item["quantidade"], 
                        item["preco_unitario"], 
                        item["quantidade"] * item["preco_unitario"], 
                        id, 
                        item["produto_id"], 
                        filial_id
                    ))
                else:
                    # Insere um novo item no pedido
                    cur.execute("""
                        INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario, total, filial_id) 
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (
                        id, 
                        item["produto_id"], 
                        item["quantidade"], 
                        item["preco_unitario"], 
                        item["quantidade"] * item["preco_unitario"], 
                        filial_id
                    ))

            conn.commit()  # Confirma todas as operações no banco de dados

        return jsonify({"message": "Pedido atualizado com sucesso!"})

    except Exception as e:
        conn.rollback()  # ❌ Cancela a transação se ocorrer um erro
        print(f"Erro ao atualizar pedido: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()  # ✅ Fecha a conexão com o banco de dados

@app.route("/pedidos/<int:id>", methods=["DELETE"])
def cancelar_pedido(id):
    """Cancela um pedido removendo-o do banco de dados junto com seus itens apenas se for da filial correta"""
    data = request.get_json()
    
    # ✅ Valida se o `filial_id` foi informado
    if "filial_id" not in data:
        return jsonify({"error": "O campo 'filial_id' é obrigatório."}), 400

    filial_id = int(data["filial_id"])  # Converte para inteiro

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # 🔹 Verifica se o pedido pertence à filial informada
            cur.execute("SELECT id FROM pedidos WHERE id = %s AND filial_id = %s", (id, filial_id))
            pedido_existente = cur.fetchone()
            
            if not pedido_existente:
                return jsonify({"error": "Pedido não encontrado ou não pertence à filial informada."}), 404

            # 🔹 Excluir primeiro os itens do pedido na filial correspondente
            cur.execute("DELETE FROM pedido_itens WHERE pedido_id = %s AND filial_id = %s", (id, filial_id))
            
            # 🔹 Agora excluir o pedido
            cur.execute("DELETE FROM pedidos WHERE id = %s AND filial_id = %s", (id, filial_id))

            conn.commit()  # ✅ Confirma as exclusões

        return jsonify({"message": "Pedido e seus itens foram cancelados com sucesso!"})

    except Exception as e:
        conn.rollback()  # ❌ Cancela a transação se ocorrer um erro
        print(f"Erro ao cancelar pedido: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()  # ✅ Fecha a conexão com o banco de dados

# ------------------------------
# 🚀 CRUD de Vendas
# ------------------------------
@app.route("/vendas", methods=["POST"])
def criar_venda():
    data = request.get_json()
    print("Recebendo dados:", data)  # 🔹 Debug dos valores recebidos

    try:
        operador_id = int(data["operador_id"])
        cliente = data.get("cliente", "Cliente Não Identificado")
        filial_id = int(data["filial_id"])
        itens = data["itens"]
        pagamentos = data["pagamentos"]
        pedido_id = data.get("pedido")
        imprimir_cupom = data.get("imprimir_cupom", False)

        # 🔹 Debug dos Itens Recebidos
        print("\n📌 Debug dos Itens Recebidos:")
        for item in itens:
            print(f"Produto ID: {item['produto_id']}, Quantidade: {item['quantidade']}, Preço Unitário: {item['preco_unitario']}, Desconto: {item.get('desconto', 0)}")

        # 🔹 Debug dos Pagamentos Recebidos
        print("\n📌 Debug dos Pagamentos Recebidos:")
        for pagamento in pagamentos:
            print(f"Forma Pagamento ID: {pagamento['forma_pagamento_id']}, Valor Pago: {pagamento['valor_pago']}, Troco: {pagamento.get('troco', 0)}")

        # ✅ Conversão explícita para `float`
        total_venda = sum(
            (float(item["quantidade"]) * float(item["preco_unitario"])) - float(item.get("desconto", 0) or 0)
            for item in itens
        )

        total_pago = sum(float(pagamento["valor_pago"]) for pagamento in pagamentos)
        troco_total = sum(float(pagamento.get("troco", 0)) for pagamento in pagamentos)  # ✅ Troco total

        print(f"\n📌 TOTAL VENDA CALCULADO: {total_venda}")
        print(f"\n📌 TOTAL PAGO: {total_pago}, TROCO TOTAL: {troco_total}")

    except (ValueError, TypeError, KeyError) as e:
        print("\n❌ Erro ao processar dados da venda:", e)
        return jsonify({"error": f"Erro ao processar os dados: {str(e)}"}), 400

    conn = get_db_connection()
    venda_id = None

    # ✅ Garantindo que cada item tenha uma descrição
    for item in itens:
        produto_id = int(item["produto_id"])
        descricao = buscar_nome_produto(produto_id, conn)
        item["descricao"] = descricao if descricao else "Produto Desconhecido"

    try:
        with conn.cursor() as cur:
            # 🔹 Inserindo venda
            print("\n📌 Inserindo Venda no Banco de Dados...")
            cur.execute("""
                INSERT INTO vendas (pedido_id, operador_id, cliente, filial_id, total, troco) 
                VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
            """, (pedido_id, operador_id, cliente, filial_id, total_venda, troco_total))
            venda_id = cur.fetchone()[0]
            print(f"✔️ Venda ID {venda_id} registrada!")

            # ✅ Se houver um pedido importado, marcar como finalizado
            if pedido_id:
                print(f"\n📌 Marcando Pedido {pedido_id} como Finalizado...")
                cur.execute("""
                    UPDATE pedidos
                    SET status = 'F'
                    WHERE id = %s
                """, (pedido_id,))
                print(f"✔️ Pedido {pedido_id} finalizado!")

            erros_estoque = []

            for item in itens:
                try:
                    produto_id = int(item["produto_id"])
                    quantidade = float(item["quantidade"])
                    preco_unitario = float(item["preco_unitario"])
                    desconto = float(item.get("desconto", 0) or 0)
                    total_item = (quantidade * preco_unitario) - desconto

                    # 🔹 Debug dos itens da venda
                    print(f"\n📌 Registrando Item da Venda:")
                    print(f"Venda ID: {venda_id}, Produto ID: {produto_id}, Quantidade: {quantidade}, Preço Unitário: {preco_unitario}, Desconto: {desconto}, Total Item: {total_item}")

                    cur.execute("""
                        INSERT INTO vendas_itens (venda_id, produto_id, quantidade, preco_unitario, desconto, total, filial_id)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (venda_id, produto_id, quantidade, preco_unitario, desconto, total_item, filial_id))

                    # 🔹 Debug do Estoque
                    print("\n📌 Verificando estoque para o produto:", produto_id)
                    cur.execute("""
                        SELECT quantidade FROM estoque_filial
                        WHERE filial_id = %s AND produto_id = %s
                    """, (filial_id, produto_id))
                    estoque_atual = cur.fetchone()

                    if estoque_atual:
                        estoque_atual = float(estoque_atual[0])
                        print(f"✔️ Estoque atual do produto {produto_id}: {estoque_atual}")
                        if estoque_atual >= quantidade:
                            print(f"✔️ Atualizando estoque do produto {produto_id}")
                            cur.execute("""
                                UPDATE estoque_filial
                                SET quantidade = quantidade - %s
                                WHERE filial_id = %s AND produto_id = %s
                            """, (quantidade, filial_id, produto_id))
                        else:
                            erros_estoque.append(f"Estoque insuficiente para o produto {produto_id}")
                    else:
                        erros_estoque.append(f"Produto {produto_id} não encontrado no estoque da filial {filial_id}")

                except Exception as e:
                    erros_estoque.append(f"Erro ao processar item {produto_id}: {str(e)}")

            if erros_estoque:
                conn.rollback()
                print("❌ Erro de estoque:", erros_estoque)
                return jsonify({"error": "Erro de estoque", "detalhes": erros_estoque}), 400

            # 🔹 Registrando pagamentos com troco
            for pagamento in pagamentos:
                forma_pagamento_id = int(pagamento["forma_pagamento_id"])
                valor_pago = float(pagamento["valor_pago"])
                troco_pagamento = float(pagamento.get("troco", 0))  # ✅ Troco por pagamento

                print(f"\n📌 Registrando Pagamento: Forma {forma_pagamento_id}, Valor {valor_pago}, Troco {troco_pagamento}")
                cur.execute("""
                    INSERT INTO vendas_pagamento (venda_id, forma_pagamento_id, valor, troco)
                    VALUES (%s, %s, %s, %s)
                """, (venda_id, forma_pagamento_id, valor_pago, troco_pagamento))

            conn.commit()
            print("✔️ Transação confirmada!")
            
        pdf_base64 = None

        # ✅ Se o usuário escolheu imprimir, gera o cupom fiscal
        if imprimir_cupom:
            print("\n📌 Gerando cupom fiscal em PDF...")
            filial_dados = buscar_dados_filial(filial_id, conn)
            pdf_bytes = gerar_pdf(venda_id, cliente, total_venda, troco_total, itens, pagamentos, filial_dados)
            pdf_base64 = base64.b64encode(pdf_bytes.getvalue()).decode("utf-8")

        return jsonify({
            "message": "Venda registrada com sucesso!",
            "venda_id": venda_id,
            "total_venda": total_venda,
            "total_pago": total_pago,
            "troco_total": troco_total,
            "cupom_fiscal_pdf": pdf_base64
        }), 201

    except Exception as e:
        conn.rollback()
        print("\n❌ Erro na venda:", str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

def gerar_pdf(venda_id, cliente, total_venda, troco_total, itens, pagamentos, filial_dados, reimpressao=False):
    """Gera um cupom fiscal otimizado para impressoras térmicas pequenas"""
    buffer = io.BytesIO()
    
    largura_pagina = 58 * mm
    altura_base = 100  
    altura_itens = len(itens) * 10
    altura_pagamentos = len(pagamentos) * 8
    altura_total = (altura_base + altura_itens + altura_pagamentos) * mm
    
    c = canvas.Canvas(buffer, pagesize=(largura_pagina, altura_total))
    c.setFont("Courier", 8)

    y = altura_total - 15  

    if filial_dados:
        c.drawString(5, y, f"{filial_dados['nome']}")
        y -= 12  
        c.drawString(5, y, f"CNPJ: {filial_dados['cnpj']}")
        y -= 10
        c.drawString(5, y, f"{filial_dados['endereco']}, {filial_dados['cidade']} - {filial_dados['estado']}")
        y -= 10
        c.drawString(5, y, f"Fone: {filial_dados['telefone']}")
        y -= 12  
        c.drawString(5, y, "-----------------------------")
        y -= 15  

    c.drawString(5, y, "        CUPOM FISCAL         ")
    y -= 12
    if reimpressao:
        c.drawString(5, y, "      ** REIMPRESSÃO **      ")
        y -= 12
    c.drawString(5, y, f"Venda ID: {venda_id}")
    y -= 10
    c.drawString(5, y, f"Cliente: {cliente}")
    y -= 12
    c.drawString(5, y, "-----------------------------")
    y -= 15

    c.setFont("Courier-Bold", 8)
    c.drawString(5, y, "QTD   DESCRIÇÃO      VL.UN  TOT")
    y -= 10
    c.drawString(5, y, "-----------------------------")
    y -= 12

    c.setFont("Courier", 8)
    for item in itens:
        descricao = item["descricao"][:12]  # ✅ Agora está correto
        quantidade = float(item["quantidade"])
        preco_unitario = float(item["preco_unitario"])
        desconto = float(item.get("desconto", 0))
        total_item = (quantidade * preco_unitario) - desconto

        c.drawString(5, y, f"{quantidade:>2}  {descricao:<12} {preco_unitario:>5.2f} {total_item:>6.2f}")
        y -= 10

    c.drawString(5, y, "-----------------------------")
    y -= 15

    c.setFont("Courier-Bold", 8)
    c.drawString(5, y, f"TOTAL VENDA:  R$ {total_venda:.2f}")
    y -= 10
    c.drawString(5, y, f"TROCO:         R$ {troco_total:.2f}")
    y -= 12
    c.drawString(5, y, "-----------------------------")
    y -= 15

    c.setFont("Courier", 8)
    for pagamento in pagamentos:
        forma_pagamento_id = int(pagamento["forma_pagamento_id"])
        valor_pago = float(pagamento.get("valor_pago", 0))  
        troco = float(pagamento.get("troco", 0))

        forma_pagamento_nome = buscar_nome_forma_pagamento(forma_pagamento_id) or f"ID {forma_pagamento_id}"

        c.drawString(5, y, f"PAG: {forma_pagamento_nome} - R$ {valor_pago:.2f}")
        if troco > 0:
            c.drawString(5, y - 10, f"Troco: R$ {troco:.2f}")
            y -= 10
        y -= 10

    c.drawString(5, y, "-----------------------------")
    y -= 12
    c.drawString(5, y, "    OBRIGADO PELA COMPRA!    ")
    y -= 12
    c.drawString(5, y, "-----------------------------")

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer

@app.route("/reimprimir_venda", methods=["POST"])
def reimprimir_venda():
    data = request.get_json()
    venda_id = data.get("venda_id")

    if not venda_id:
        return jsonify({"error": "ID da venda é obrigatório"}), 400

    conn = get_db_connection()

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # 🔹 Buscar informações da venda
            cur.execute("""
                SELECT pedido_id, operador_id, cliente, filial_id, 
                       COALESCE(total, 0.0) AS total, 
                       COALESCE(troco, 0.0) AS troco
                FROM vendas
                WHERE id = %s
            """, (venda_id,))
            venda = cur.fetchone()

            if not venda:
                return jsonify({"error": "Venda não encontrada"}), 404

            # 🔹 Buscar itens da venda **com a descrição do produto**
            cur.execute("""
                SELECT vi.produto_id, 
                       COALESCE(vi.quantidade, 0.0) AS quantidade, 
                       COALESCE(vi.preco_unitario, 0.0) AS preco_unitario, 
                       COALESCE(vi.desconto, 0.0) AS desconto, 
                       COALESCE(p.nome, 'Descrição não encontrada') AS descricao
                FROM vendas_itens vi
                LEFT JOIN produtos p ON vi.produto_id = p.id  -- ✅ Busca a descrição do produto baseado no ID
                WHERE vi.venda_id = %s
            """, (venda_id,))
            itens = cur.fetchall()

            # 🔹 Buscar pagamentos da venda
            cur.execute("""
                SELECT vp.forma_pagamento_id, 
                       COALESCE(vp.valor, 0.0) AS valor, 
                       COALESCE(vp.troco, 0.0) AS troco
                FROM vendas_pagamento vp
                WHERE vp.venda_id = %s
            """, (venda_id,))
            pagamentos = cur.fetchall()

            # 🔹 Buscar dados da filial
            filial_dados = buscar_dados_filial(venda["filial_id"], conn)

        # ✅ Garantir que todos os valores sejam numéricos antes de passar para `float()`
        total_venda = float(venda["total"])
        troco_total = float(venda["troco"])

        for item in itens:
            item["quantidade"] = float(item["quantidade"])
            item["preco_unitario"] = float(item["preco_unitario"])
            item["desconto"] = float(item["desconto"])

        for pagamento in pagamentos:
            pagamento["valor"] = float(pagamento["valor"])
            pagamento["troco"] = float(pagamento["troco"])

        # ✅ Gerar o cupom fiscal sem erro de NoneType
        pdf_bytes = gerar_pdf(
            venda_id=venda_id,
            cliente=venda["cliente"],
            total_venda=total_venda,
            troco_total=troco_total,
            itens=itens,
            pagamentos=pagamentos,
            filial_dados=filial_dados,
            reimpressao=True
        )

        pdf_base64 = base64.b64encode(pdf_bytes.getvalue()).decode("utf-8")

        return jsonify({
            "message": "Reimpressão gerada com sucesso!",
            "cupom_fiscal_pdf": pdf_base64
        }), 200

    except Exception as e:
        print("Erro ao reimprimir venda:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()

@app.route("/vendas", methods=["GET"])
def listar_vendas():
    """Lista todas as vendas disponíveis para reimpressão com filtro por período."""
    conn = get_db_connection()
    try:
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        print("Start Date:", start_date, "End Date:", end_date)  # 🔹 Debug: veja as datas recebidas

        query = """
            SELECT v.id, v.cliente, v.filial_id, v.total, v.troco, v.data_venda
            FROM vendas v
        """
        params = []

        if start_date and end_date:
            try:
                # 🔹 Garante que as datas estejam corretas
                start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

                # 🔹 Usa >= e <= para considerar o TIMESTAMP corretamente
                query += " WHERE v.data_venda >= %s AND v.data_venda <= %s"
                params = [f"{start_date} 00:00:00", f"{end_date} 23:59:59"]
            except ValueError:
                return jsonify({"error": "Formato de data inválido. Use YYYY-MM-DD"}), 400

        query += " ORDER BY v.data_venda DESC"

        print("QUERY SQL:", query, params)  # 🔹 Debug: imprime a query gerada

        with conn.cursor() as cur:
            cur.execute(query, params)
            vendas = cur.fetchall()

        lista_vendas = []
        for venda in vendas:
            venda_id, cliente, filial_id, total_venda, troco, data_venda = venda

            # Buscar o nome da filial
            filial_dados = buscar_dados_filial(filial_id, conn)

            lista_vendas.append({
                "venda_id": venda_id,
                "cliente": cliente,
                "filial_id": filial_id,
                "filial_nome": filial_dados["nome"] if filial_dados else "Desconhecida",
                "total_venda": total_venda,
                "troco": troco,
                "data_venda": data_venda.strftime("%Y-%m-%d %H:%M:%S")  # 🔹 Garante a formatação correta
            })

        return jsonify(lista_vendas), 200

    except Exception as e:
        print("Erro ao listar vendas:", str(e))
        return jsonify({"error": f"Erro ao buscar vendas: {str(e)}"}), 500
    finally:
        conn.close()

def buscar_dados_filial(filial_id, conn):
    """Busca os dados da filial no banco de dados"""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT nome, endereco, telefone, cidade, estado, cnpj 
            FROM filiais WHERE id = %s
        """, (filial_id,))
        filial = cur.fetchone()
        if filial:
            return {
                "nome": filial[0],
                "endereco": filial[1],
                "telefone": filial[2],
                "cidade": filial[3],
                "estado": filial[4],
                "cnpj": filial[5]
            }
        return None

def buscar_nome_produto(produto_id, conn):
    """Busca o nome do produto no banco de dados"""
    with conn.cursor() as cur:
        cur.execute("SELECT nome FROM produtos WHERE id = %s", (produto_id,))
        produto = cur.fetchone()
        return produto[0] if produto else f"Produto {produto_id}"
    
def buscar_nome_forma_pagamento(forma_pagamento_id):
    conn = get_db_connection()
    """Busca o nome da forma de pagamento no banco de dados"""
    with conn.cursor() as cur:
        cur.execute("SELECT nome FROM formas_pagamento WHERE id = %s", (forma_pagamento_id,))
        forma_pagamento = cur.fetchone()
        return forma_pagamento[0] if forma_pagamento else f"Forma {forma_pagamento_id}"


@app.route("/formas_pagamento", methods=["GET"])
def listar_formas_pagamento():
    """Retorna todas as formas de pagamento disponíveis."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, nome FROM formas_pagamento ORDER BY nome")
            formas_pagamento = [{"id": row[0], "nome": row[1]} for row in cur.fetchall()]
        return jsonify(formas_pagamento), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/vendas/<int:id>", methods=["DELETE"])
def cancelar_venda(id):
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("DELETE FROM vendas WHERE id = %s", (id,))
        conn.commit()
    conn.close()
    return jsonify({"message": "Venda cancelada!"})


@app.route("/filiais", methods=["GET"])
def listar_filiais():
    """Lista todas as filiais ou uma filial específica se filial_id for passado."""
    filial_id = request.args.get("filial_id")  # 🔹 Obtém o parâmetro opcional

    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            if filial_id:
                cur.execute("SELECT * FROM filiais WHERE id = %s", (filial_id,))
            else:
                cur.execute("SELECT * FROM filiais")

            filiais = cur.fetchall()
            colnames = [desc[0] for desc in cur.description]
            results = [dict(zip(colnames, row)) for row in filiais]

        return jsonify(results)  # Retorna os dados como JSON

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/niveis_acesso", methods=["GET"])
def listar_niveis_acesso():
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM niveis_acesso")
            filiais = cur.fetchall()
            colnames = [desc[0] for desc in cur.description]
            results = [dict(zip(colnames, row)) for row in filiais]
        return jsonify(results)  # Retorna os dados como JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500
def remove_mask(value):
    """Remove caracteres não numéricos (para CNPJ e CEP)"""
    if value:
        return ''.join(filter(str.isdigit, value))
    return None


@app.route("/filiais-cadastrar", methods=["POST"])
def criar_filial():
    """Cria uma nova filial."""
    data = request.json

    # 🔹 Verificar se os campos obrigatórios foram enviados
    required_fields = ["nome", "estado", "cnpj"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Campos obrigatórios estão faltando."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            # 🔹 Se não fornecer um código, criar um automaticamente
            if not data.get("codigo"):
                cur.execute("SELECT COUNT(*) FROM filiais")
                count = cur.fetchone()[0] + 1
                data["codigo"] = f"Filial {count}"

            # 🔹 Remover formatação do CNPJ e CEP antes de salvar
            cnpj_clean = remove_mask(data.get("cnpj"))
            cep_clean = remove_mask(data.get("cep"))

            # 🔹 Verificar se o CNPJ já está cadastrado
            cur.execute("SELECT id FROM filiais WHERE cnpj = %s", (cnpj_clean,))
            if cur.fetchone():
                return jsonify({"error": "CNPJ já está cadastrado."}), 400

            # 🔹 Inserir no banco
            cur.execute("""
                INSERT INTO filiais (nome, codigo, telefone, endereco, cidade, estado, cnpj, cep, ativo)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
            """, (
                data["nome"],
                data["codigo"],
                data.get("telefone"),
                data.get("endereco"),
                data.get("cidade"),
                data.get("estado"),
                cnpj_clean,   # 🔹 CNPJ sem máscara
                cep_clean,    # 🔹 CEP sem máscara
                data.get("ativo", True)
            ))
            
            filial_id = cur.fetchone()[0]
            conn.commit()

        return jsonify({
            "message": "Filial criada com sucesso.",
            "id": filial_id,
            "codigo": data["codigo"]
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/filiais/<int:id>", methods=["PUT"])
def atualizar_filial(id):
    """Atualiza os dados de uma filial."""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            # Verifica se o ID da filial existe antes de atualizar
            cur.execute("SELECT id FROM filiais WHERE id = %s", (id,))
            if not cur.fetchone():
                return jsonify({"error": "Filial não encontrada."}), 404

            # Atualiza os dados da filial, incluindo o CNPJ, CEP e código
            cur.execute("""
                UPDATE filiais
                SET nome = %s, codigo = %s, cnpj = %s, telefone = %s, cep = %s, endereco = %s, cidade = %s, estado = %s
                WHERE id = %s
            """, (
                data["nome"],
                data.get("codigo"),  # ✅ Adicionado campo 'codigo'
                data.get("cnpj"),
                data.get("telefone"),
                data.get("cep"),
                data.get("endereco"),
                data.get("cidade"),
                data.get("estado"),
                id
            ))
            conn.commit()

        return jsonify({"message": "Filial atualizada com sucesso."}), 200

    except Exception as e:
        conn.rollback()
        print(f"Erro ao atualizar filial: {e}")  # 🔹 Mostra erro detalhado no console
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()



@app.route("/filiais/<int:id>", methods=["DELETE"])
def excluir_filial(id):
    """Exclui uma filial."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM filiais WHERE id = %s", (id,))
            conn.commit()
        return jsonify({"message": "Filial excluída com sucesso."}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

### Criar Classe
@app.route("/classes", methods=["POST"])
def criar_classe():
    """Cria uma nova classe."""
    data = request.json
    if not data.get("nome"):
        return jsonify({"error": "O campo 'nome' é obrigatório."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO classes (nome, descricao)
                VALUES (%s, %s) RETURNING id
            """, (data["nome"], data.get("descricao")))
            classe_id = cur.fetchone()[0]
            conn.commit()
        return jsonify({"message": "Classe criada com sucesso.", "id": classe_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

### Alterar Classe
@app.route("/classes/<int:id>", methods=["PUT"])
def alterar_classe(id):
    """Atualiza uma classe pelo ID."""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE classes
                SET nome = %s, descricao = %s
                WHERE id = %s
            """, (data.get("nome"), data.get("descricao"), id))
            if cur.rowcount == 0:
                return jsonify({"error": "Classe não encontrada."}), 404
            conn.commit()
        return jsonify({"message": "Classe atualizada com sucesso."}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

### Deletar Classe
@app.route("/classes/<int:id>", methods=["DELETE"])
def deletar_classe(id):
    """Exclui uma classe pelo ID."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM classes WHERE id = %s", (id,))
            if cur.rowcount == 0:
                return jsonify({"error": "Classe não encontrada."}), 404
            conn.commit()
        return jsonify({"message": "Classe excluída com sucesso."}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

### Listar Classes
@app.route("/classes", methods=["GET"])
def listar_classes():
    """Lista todas as classes."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, nome, descricao FROM classes")
            rows = cur.fetchall()
            colunas = [desc[0] for desc in cur.description]
            classes = [dict(zip(colunas, row)) for row in rows]
        return jsonify(classes)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# =================== Clientes ===================

@app.route("/clientes", methods=["GET"])
def listar_clientes():
    """Lista todos os clientes."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM clientes")
            rows = cur.fetchall()
            colunas = [desc[0] for desc in cur.description]
            clientes = [dict(zip(colunas, row)) for row in rows]
        return jsonify(clientes)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/clientes/<int:id>", methods=["GET"])
def obter_cliente(id):
    """Obtém um cliente pelo ID."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM clientes WHERE id = %s", (id,))
            row = cur.fetchone()
            if row:
                colunas = [desc[0] for desc in cur.description]
                cliente = dict(zip(colunas, row))
                return jsonify(cliente)
            else:
                return jsonify({"error": "Cliente não encontrado."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/clientes", methods=["POST"])
def criar_cliente():
    """Cria um novo cliente."""
    data = request.json
    print("📌 Dados Recebidos:", data)  # 🔍 Log dos dados recebidos
    required_fields = ["nome", "cpf_cnpj"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Campos obrigatórios estão faltando."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            # Verificar se o CPF/CNPJ já está cadastrado
            cur.execute("SELECT id FROM clientes WHERE cpf_cnpj = %s", (data["cpf_cnpj"],))
            if cur.fetchone():
                return jsonify({"error": "CPF/CNPJ já está cadastrado."}), 400

            cur.execute("""
                INSERT INTO clientes (nome, cpf_cnpj, endereco, telefone, email, cidade, estado)
                VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id
            """, (
                data["nome"],
                data["cpf_cnpj"],
                data.get("endereco", ""),
                data.get("telefone", ""),
                data.get("email", ""),
                data.get("cidade", "Desconhecido"),
                data.get("estado", "XX")  # "XX" para estados desconhecidos
            ))

            cliente_id = cur.fetchone()[0]
            conn.commit()
        return jsonify({"message": "Cliente criado com sucesso.", "id": cliente_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/clientes/<int:id>", methods=["PUT"])
def atualizar_cliente(id):
    """Atualiza os dados de um cliente existente no banco de dados."""
    
    data = request.json
    print("📌 Dados Recebidos para Atualização:", data)  # Log dos dados recebidos para depuração

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            # Verificar se o cliente existe
            cur.execute("SELECT id FROM clientes WHERE id = %s", (id,))
            if not cur.fetchone():
                return jsonify({"error": "Cliente não encontrado."}), 404

            # Verificar se o CPF/CNPJ já está cadastrado em outro cliente
            cur.execute("SELECT id FROM clientes WHERE cpf_cnpj = %s AND id != %s", (data["cpf_cnpj"], id))
            if cur.fetchone():
                return jsonify({"error": "CPF/CNPJ já está cadastrado em outro cliente."}), 400

            # Atualizar os dados do cliente
            cur.execute("""
                UPDATE clientes
                SET nome = %s, cpf_cnpj = %s, endereco = %s, telefone = %s, email = %s, cidade = %s, estado = %s
                WHERE id = %s
            """, (
                data["nome"],
                data["cpf_cnpj"],
                data.get("endereco", ""),   # Evita inserir NULL
                data.get("telefone", ""),   # Evita inserir NULL
                data.get("email", ""),      # Evita inserir NULL
                data.get("cidade", "Desconhecido"),  # Valor padrão caso não enviado
                data.get("estado", "XX"),  # XX para estados desconhecidos
                id
            ))

            conn.commit()

        return jsonify({"message": "Cliente atualizado com sucesso."})

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()

@app.route("/clientes/<int:id>", methods=["DELETE"])
def excluir_cliente(id):
    """Exclui um cliente pelo ID."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM clientes WHERE id = %s", (id,))
            conn.commit()
        return jsonify({"message": "Cliente excluído com sucesso."})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# =================== Produtos ===================

@app.route("/produtos", methods=["GET"])
def listar_produtos():
    """Lista todos os produtos com os estoques por filial, imagem, nome da categoria, nome da classe, custo médio e custo anterior.""" 
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            # Consulta para buscar os produtos, estoques, nome da categoria e nome da classe
            cur.execute("""
                SELECT 
                    p.id AS produto_id,
                    p.nome AS produto_nome,
                    p.codigo_barras,
                    p.preco_custo,
                    p.preco_venda,
                    p.margem,
                    p.categoria_id,
                    c.nome AS categoria_nome, -- Nome da categoria
                    p.classe_id,
                    cl.nome AS classe_nome,   -- Nome da classe
                    p.ativo,
                    p.criado_em,
                    p.atualizado_em,
                    ef.filial_id,
                    ef.quantidade,
                    ef.estoque_minimo,
                    p.imagem,                -- Adiciona a imagem
                    p.custo_medio,           -- Adiciona o custo médio
                    p.custo_anterior         -- Adiciona o custo anterior
                FROM produtos p
                LEFT JOIN estoque_filial ef ON p.id = ef.produto_id
                LEFT JOIN categorias c ON p.categoria_id = c.id -- Junção com a tabela de categorias
                LEFT JOIN classes cl ON p.classe_id = cl.id     -- Junção com a tabela de classes
            """)
            rows = cur.fetchall()
            
            if not rows:
                return jsonify([])  # Retorna lista vazia se não houver produtos
            
            colunas = [desc[0] for desc in cur.description]
            produtos = {}

            # Organiza os dados em um formato estruturado
            for row in rows:
                row_dict = dict(zip(colunas, row))
                produto_id = row_dict.pop("produto_id")
                
                if produto_id not in produtos:
                    produtos[produto_id] = {
                        "id": produto_id,
                        "nome": row_dict["produto_nome"],
                        "codigo_barras": row_dict["codigo_barras"],
                        "preco_custo": row_dict["preco_custo"],
                        "preco_venda": row_dict["preco_venda"],
                        "margem": row_dict["margem"],
                        "categoria_id": row_dict["categoria_id"],
                        "categoria_nome": row_dict["categoria_nome"],  # Nome da categoria
                        "classe_id": row_dict["classe_id"],
                        "classe_nome": row_dict["classe_nome"],        # Nome da classe
                        "ativo": row_dict["ativo"],
                        "criado_em": row_dict["criado_em"],
                        "atualizado_em": row_dict["atualizado_em"],
                        "custo_medio": row_dict["custo_medio"],        # Custo médio
                        "custo_anterior": row_dict["custo_anterior"],  # Custo anterior
                        "estoques": [],
                        "imagem": None  # Inicializa a imagem
                    }

                # Converte imagem para base64, se existir
                if row_dict["imagem"]:
                    produtos[produto_id]["imagem"] = base64.b64encode(row_dict["imagem"]).decode("utf-8")

                # Adiciona informações de estoque da filial
                if row_dict["filial_id"] is not None:
                    produtos[produto_id]["estoques"].append({
                        "filial_id": row_dict["filial_id"],
                        "quantidade": row_dict["quantidade"],
                        "estoque_minimo": row_dict["estoque_minimo"]
                    })

        # Converte o dicionário para uma lista de produtos
        return jsonify(list(produtos.values()))
    
    except Exception as e:
        print(f"Erro: {e}")  # Para ajudar na depuração
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/produtos/<int:id>/imagem', methods=['PUT'])
def atualizar_imagem_produto(id):
    """Atualiza a imagem de um produto."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        if 'imagem' not in request.files:
            return jsonify({"error": "Nenhum arquivo foi enviado."}), 400

        imagem = request.files['imagem']
        if imagem:
            imagem_binario = imagem.read()

            # Adicione logs para verificar os dados recebidos
            print(f"Produto ID: {id}, Tamanho da imagem: {len(imagem_binario)} bytes")

            with conn.cursor() as cur:
                # Verificar se o produto existe
                cur.execute("SELECT id FROM produtos WHERE id = %s", (id,))
                if not cur.fetchone():
                    return jsonify({"error": "Produto não encontrado."}), 404

                # Atualizar a imagem no banco de dados
                cur.execute("""
                    UPDATE produtos
                    SET imagem = %s
                    WHERE id = %s
                """, (psycopg2.Binary(imagem_binario), id))

                conn.commit()
                print("Imagem salva com sucesso no banco.")
            return jsonify({"message": "Imagem atualizada com sucesso."}), 200
    except Exception as e:
        conn.rollback()
        print(f"Erro ao atualizar a imagem: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Excluir imagem de um produto
@app.route('/produtos/<int:id>/imagem', methods=['DELETE'])
def excluir_imagem_produto(id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            # Remover apenas a imagem
            cur.execute("""
                UPDATE produtos
                SET imagem = NULL
                WHERE id = %s
            """, (id,))

            conn.commit()
        return jsonify({"message": "Imagem removida com sucesso."}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/produtos", methods=["POST"])
def criar_produto():
    """Cria um novo produto com detalhes de estoque por filial, categoria e classe."""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            # Verificar campos obrigatórios
            required_fields = ["nome", "codigo_barras", "preco_custo", "preco_venda", "categoria_id", "classe_id"]
            if not all(field in data for field in required_fields):
                return jsonify({"error": "Campos obrigatórios estão faltando."}), 400

            # Verificar se o código de barras já existe
            cur.execute("""
                SELECT id FROM produtos WHERE codigo_barras = %s
            """, (data["codigo_barras"],))
            if cur.fetchone():
                return jsonify({"error": "Código de barras já está cadastrado."}), 400

            # Inserir o produto na tabela `produtos`
            cur.execute("""
                INSERT INTO produtos (nome, codigo_barras, preco_custo, preco_venda, categoria_id, classe_id, custo_medio, custo_anterior)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
            """, (
                data["nome"],
                data["codigo_barras"],
                data["preco_custo"],
                data["preco_venda"],
                data["categoria_id"],  # ID da categoria
                data["classe_id"],     # ID da classe
                data["preco_custo"],   # Inicializa o custo médio com o preço de custo
                None                   # Inicializa o custo anterior como NULL
            ))
            produto_id = cur.fetchone()[0]

            # Inserir o estoque inicial por filial, se fornecido
            for filial in data.get("estoques", []):  # `estoques` é uma lista de objetos com filial_id e quantidade
                cur.execute("""
                    INSERT INTO estoque_filial (filial_id, produto_id, quantidade, estoque_minimo)
                    VALUES (%s, %s, %s, %s)
                """, (
                    filial["filial_id"],
                    produto_id,
                    filial.get("quantidade", 0),        # Quantidade inicial
                    filial.get("estoque_minimo", 0)     # Estoque mínimo
                ))

            conn.commit()
        return jsonify({"message": "Produto criado com sucesso.", "id": produto_id}), 201
    except Exception as e:
        print(e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/produtos/<int:id>", methods=["PUT"])
def atualizar_produto(id):
    """Atualiza os dados do produto, incluindo nome, código de barras, classe, categoria, custos e preço de venda."""
    data = request.json

    try:
        # Converte os valores recebidos para tipos apropriados
        novo_custo = Decimal(data.get("preco_custo", 0))  # Convertendo para Decimal
        novo_preco_venda = Decimal(data.get("preco_venda", 0))  # Convertendo para Decimal
        nova_quantidade = int(data.get("quantidade", 0))
        nome = data.get("nome", "").strip()
        codigo_barras = data.get("codigo_barras", "").strip()
        classe_id = data.get("classe_id")  # Inteiro ou None
        categoria_id = data.get("categoria_id")  # Inteiro ou None
    except (ValueError, TypeError):
        return jsonify({"error": "Dados inválidos. Verifique os campos enviados."}), 400

    if not nome or not codigo_barras:
        return jsonify({"error": "Os campos 'nome' e 'codigo_barras' são obrigatórios."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            # Buscar o custo atual e o custo médio do produto
            cur.execute("""
                SELECT preco_custo, custo_medio
                FROM produtos
                WHERE id = %s
            """, (id,))
            produto = cur.fetchone()
            if not produto:
                return jsonify({"error": "Produto não encontrado."}), 404

            custo_atual, custo_medio = produto

            # Converter valores retornados do banco para Decimal
            custo_atual = Decimal(custo_atual) if custo_atual is not None else Decimal(0)
            custo_medio = Decimal(custo_medio) if custo_medio is not None else custo_atual

            # Atualizar o custo anterior com o custo atual
            custo_anterior = custo_atual

            # Evitar divisão por zero caso `nova_quantidade` seja 0
            novo_custo_medio = (
                (custo_medio * Decimal(nova_quantidade) + novo_custo)
                / (Decimal(nova_quantidade) + Decimal(1))
            )

            # Atualizar os valores no banco de dados
            cur.execute("""
                UPDATE produtos
                SET nome = %s,                -- Atualiza o nome
                    codigo_barras = %s,       -- Atualiza o código de barras
                    classe_id = %s,           -- Atualiza a classe (se fornecida)
                    categoria_id = %s,        -- Atualiza a categoria (se fornecida)
                    custo_anterior = %s,      -- Move o custo atual para custo anterior
                    preco_custo = %s,         -- Atualiza o custo atual
                    custo_medio = %s,         -- Atualiza o custo médio
                    preco_venda = %s          -- Atualiza o preço de venda
                WHERE id = %s
            """, (
                nome,
                codigo_barras,
                classe_id,
                categoria_id,
                custo_anterior,
                novo_custo,
                novo_custo_medio,
                novo_preco_venda,
                id
            ))

            conn.commit()
        return jsonify({"message": "Produto atualizado com sucesso."}), 200
    except Exception as e:
        print(e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/produtos/<int:id>", methods=["DELETE"])
def excluir_produto(id):
    """Exclui um produto pelo ID, removendo itens relacionados e entradas correspondentes."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            # Verificar se o produto existe
            cur.execute("SELECT id FROM produtos WHERE id = %s", (id,))
            produto = cur.fetchone()
            if not produto:
                return jsonify({"error": "Produto não encontrado."}), 404

            # Buscar IDs das entradas relacionadas ao produto na tabela itens_entrada
            cur.execute("""
                SELECT DISTINCT entrada_id
                FROM itens_entrada
                WHERE produto_id = %s
            """, (id,))
            entradas_relacionadas = cur.fetchall()

            # Remover os itens associados ao produto na tabela itens_entrada
            cur.execute("""
                DELETE FROM itens_entrada
                WHERE produto_id = %s
            """, (id,))

            # Remover as entradas relacionadas ao produto na tabela entradas
            for entrada_id in entradas_relacionadas:
                cur.execute("""
                    DELETE FROM entradas
                    WHERE id = %s
                """, (entrada_id,))

            # Finalmente, excluir o produto da tabela produtos
            cur.execute("""
                DELETE FROM produtos
                WHERE id = %s
            """, (id,))

            conn.commit()
        return jsonify({"message": "Produto e itens relacionados excluídos com sucesso."}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/categorias", methods=["GET"])
def listar_categorias():
    conn = get_db_connection()  # Função para conectar ao banco de dados

    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, nome FROM categorias")
            categorias = cur.fetchall()  # Obtém todas as categorias

        # Converte os resultados em um formato JSON-friendly
        categorias_list = [{"id": row[0], "nome": row[1]} for row in categorias]

        return jsonify(categorias_list), 200
    except Exception as e:
        return jsonify({"error": f"Erro ao listar categorias: {str(e)}"}), 500
    finally:
        conn.close()  # Fecha a conexão com o banco de dados


@app.route("/categorias", methods=["POST"])
def criar_categoria():
    data = request.json  # Obtém os dados JSON enviados na requisição
    conn = get_db_connection()  # Função para conectar ao banco de dados

    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO categorias (nome)
                VALUES (%s) RETURNING id
            """, (
                data["nome"],  # Nome da categoria
            ))
            categoria_id = cur.fetchone()[0]  # Obtém o ID da categoria criada
            conn.commit()  # Confirma a transação no banco de dados

        return jsonify({"message": "Categoria criada com sucesso.", "id": categoria_id}), 201
    except Exception as e:
        conn.rollback()  # Reverte a transação em caso de erro
        return jsonify({"error": f"Erro ao criar categoria: {str(e)}"}), 500
    finally:
        conn.close()  # Fecha a conexão com o banco de dados

@app.route("/categorias/<int:id>", methods=["PUT"])
def atualizar_categoria(id):
    data = request.json
    conn = get_db_connection()  # Conexão com o banco de dados

    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            # Atualiza apenas o campo 'nome'
            cur.execute("""
                UPDATE categorias
                SET nome = %s
                WHERE id = %s
            """, (
                data.get("nome"),  # Novo nome da categoria
                id                 # ID da categoria a ser atualizada
            ))

            # Verifica se a categoria foi encontrada e atualizada
            if cur.rowcount == 0:
                return jsonify({"error": "Categoria não encontrada."}), 404

            conn.commit()  # Confirma a transação
        return jsonify({"message": "Categoria atualizada com sucesso."}), 200
    except Exception as e:
        conn.rollback()  # Reverte a transação em caso de erro
        return jsonify({"error": f"Erro ao atualizar categoria: {str(e)}"}), 500
    finally:
        conn.close()  # Fecha a conexão com o banco


# Deletar categoria
@app.route("/categorias/<int:id>", methods=["DELETE"])
def deletar_categoria(id):
    conn = get_db_connection()

    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM categorias
                WHERE id = %s
            """, (id,))
            if cur.rowcount == 0:
                return jsonify({"error": "Categoria não encontrada."}), 404

            conn.commit()  # Confirma a exclusão
        return jsonify({"message": "Categoria deletada com sucesso."}), 200
    except Exception as e:
        conn.rollback()  # Reverte a transação em caso de erro
        return jsonify({"error": f"Erro ao deletar categoria: {str(e)}"}), 500
    finally:
        conn.close()  # Fecha a conexão com o banco


@app.route("/entradas", methods=["GET"])
def obter_entradas():
    """Retorna todas as entradas e seus respectivos itens, incluindo o nome do fornecedor, produto e filial."""
    conn = get_db_connection()
    
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    
    try:
        with conn.cursor() as cur:
            # Busca todas as entradas junto com o nome do fornecedor e filial
            cur.execute("""
                SELECT 
                    e.id AS entrada_id,
                    e.fornecedor_id,
                    f.nome AS fornecedor_nome,
                    e.data_entrada,
                    e.total,
                    e.observacoes,
                    e.criado_em,
                    e.atualizado_em,
                    e.filial_id,
                    fi.nome AS filial_nome
                FROM entradas e
                JOIN fornecedores f ON e.fornecedor_id = f.id
                JOIN filiais fi ON e.filial_id = fi.id
            """)
            entradas = cur.fetchall()

            # Para cada entrada, buscar os itens relacionados
            entradas_com_itens = []
            for entrada in entradas:
                cur.execute("""
                    SELECT 
                        i.id AS item_id,
                        i.entrada_id,
                        i.produto_id,
                        p.nome AS produto_nome,
                        i.quantidade,
                        i.preco_custo,
                        i.subtotal
                    FROM itens_entrada i
                    JOIN produtos p ON i.produto_id = p.id
                    WHERE i.entrada_id = %s
                """, (entrada[0],))  # entrada_id
                itens = cur.fetchall()

                # Construindo a resposta detalhada
                entradas_com_itens.append({
                    "entrada": {
                        "id": entrada[0],
                        "fornecedor_id": entrada[1],
                        "fornecedor_nome": entrada[2],
                        "data_entrada": entrada[3],
                        "total": entrada[4],
                        "observacoes": entrada[5],
                        "criado_em": entrada[6],
                        "atualizado_em": entrada[7],
                        "filial_id": entrada[8],
                        "filial_nome": entrada[9],
                    },
                    "itens": [
                        {
                            "id": item[0],
                            "entrada_id": item[1],
                            "produto_id": item[2],
                            "produto_nome": item[3],
                            "quantidade": item[4],
                            "preco_custo": item[5],
                            "subtotal": item[6],
                        }
                        for item in itens
                    ]
                })

        return jsonify(entradas_com_itens), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        conn.close()

@app.route("/entradas-notas", methods=["POST"])
def criar_entrada():
    """Cria uma nova entrada e adiciona os itens relacionados, atualizando custos e estoque."""
    data = request.json
    conn = get_db_connection()

    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            # Inserir a entrada na tabela 'entradas'
            cur.execute("""
                INSERT INTO entradas (fornecedor_id, total, observacoes, filial_id)
                VALUES (%s, %s, %s, %s) RETURNING id
            """, (
                data["fornecedor_id"],
                Decimal(str(data["total"])),  # Converte para Decimal
                data["observacoes"],
                data["filial_id"]
            ))
            entrada_id = cur.fetchone()[0]

            # Processar os itens da entrada
            for item in data["itens"]:
                produto_id = item["produto_id"]
                nova_quantidade = Decimal(str(item["quantidade"]))  # Converter para Decimal
                novo_preco_custo = Decimal(str(item["preco_custo"]))  # Converter para Decimal

                # Inserir o item na tabela 'itens_entrada'
                cur.execute("""
                    INSERT INTO itens_entrada (entrada_id, produto_id, quantidade, preco_custo, fornecedor_id, filial_id)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    entrada_id,
                    produto_id,
                    nova_quantidade,
                    novo_preco_custo,
                    data["fornecedor_id"],
                    data["filial_id"]
                ))

                # Atualizar o estoque na tabela 'estoque_filial'
                cur.execute("""
                    INSERT INTO estoque_filial (filial_id, produto_id, quantidade)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (filial_id, produto_id)
                    DO UPDATE SET quantidade = estoque_filial.quantidade + EXCLUDED.quantidade
                """, (
                    data["filial_id"],
                    produto_id,
                    nova_quantidade
                ))

                # Obter a quantidade atual do estoque
                cur.execute("""
                    SELECT quantidade FROM estoque_filial
                    WHERE filial_id = %s AND produto_id = %s
                """, (data["filial_id"], produto_id))
                estoque = cur.fetchone()
                quantidade_atual = Decimal(str(estoque[0])) if estoque else Decimal("0.000")

                # Buscar custo atual do produto
                cur.execute("""
                    SELECT preco_custo, custo_medio
                    FROM produtos
                    WHERE id = %s
                """, (produto_id,))
                produto = cur.fetchone()

                if produto:
                    custo_atual = Decimal(str(produto[0]))
                    custo_medio = Decimal(str(produto[1])) if produto[1] is not None else custo_atual

                    # Calcular novo custo médio
                    quantidade_total = quantidade_atual + nova_quantidade
                    if quantidade_total > 0:
                        novo_custo_medio = (
                            (custo_medio * quantidade_atual + novo_preco_custo * nova_quantidade)
                            / quantidade_total
                        )
                    else:
                        novo_custo_medio = novo_preco_custo  # Se for a primeira entrada, define o novo custo como custo médio

                    # Atualizar custos do produto
                    cur.execute("""
                        UPDATE produtos
                        SET custo_anterior = preco_custo,
                            preco_custo = %s,
                            custo_medio = %s
                        WHERE id = %s
                    """, (novo_preco_custo, novo_custo_medio, produto_id))

            # Commit para salvar todas as alterações no banco de dados
            conn.commit()

        return jsonify({"message": "Entrada, itens e custos atualizados com sucesso."}), 201

    except Exception as e:
        print(f"Erro ao processar entrada: {e}")  # Log de erro
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()


@app.route("/entradas/<int:id>/cancelar", methods=["DELETE"])
def cancelar_entrada(id):
    """Cancela uma entrada (exclui todos os itens e ajusta o estoque)."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            print(f"Tentando cancelar entrada com ID: {id}")

            # Buscar todos os itens associados à entrada
            cur.execute("""
                SELECT produto_id, quantidade, filial_id 
                FROM itens_entrada 
                WHERE entrada_id = %s
            """, (id,))
            itens = cur.fetchall()
            print(f"Itens associados à entrada: {itens}")

            # Ajustar o estoque dos produtos (somente se houver itens)
            if itens:
                for produto_id, quantidade, filial_id in itens:
                    print(f"Ajustando estoque para Produto ID: {produto_id}, Filial ID: {filial_id}")
                    cur.execute("""
                        UPDATE estoque_filial
                        SET quantidade = quantidade - %s
                        WHERE produto_id = %s AND filial_id = %s
                    """, (quantidade, produto_id, filial_id))
                    print(f"Rows afetadas: {cur.rowcount}")
                    if cur.rowcount == 0:
                        print(f"Estoque não encontrado para Produto ID {produto_id} e Filial ID {filial_id}")
                        return jsonify({"error": f"Estoque não encontrado para Produto ID {produto_id} e Filial ID {filial_id}"}), 400

                # Excluir todos os itens associados à entrada
                cur.execute("DELETE FROM itens_entrada WHERE entrada_id = %s", (id,))
                print(f"Itens excluídos para a entrada {id}")

            # Excluir a entrada mesmo que não existam itens
            cur.execute("DELETE FROM entradas WHERE id = %s", (id,))
            print(f"Entrada {id} excluída com sucesso")

            conn.commit()
        return jsonify({"message": "Entrada cancelada e estoque ajustado com sucesso."}), 200
    except Exception as e:
        conn.rollback()
        print(f"Erro ao cancelar entrada: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# =================== Fornecedores ===================

@app.route("/fornecedores", methods=["GET"])
def listar_fornecedores():
    """Lista todos os fornecedores."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM fornecedores ORDER BY nome ASC")
            rows = cur.fetchall()
            colunas = [desc[0] for desc in cur.description]
            fornecedores = [dict(zip(colunas, row)) for row in rows]
        return jsonify(fornecedores)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/fornecedores/<int:id>", methods=["GET"])
def obter_fornecedor(id):
    """Obtém um fornecedor pelo ID."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM fornecedores WHERE id = %s", (id,))
            row = cur.fetchone()
            if not row:
                return jsonify({"error": "Fornecedor não encontrado."}), 404
            colunas = [desc[0] for desc in cur.description]
            fornecedor = dict(zip(colunas, row))
        return jsonify(fornecedor)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/fornecedores", methods=["POST"])
def criar_fornecedor():
    """Cria um novo fornecedor."""
    data = request.json
    required_fields = ["nome", "cnpj", "estado", "cidade", "cep"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Campos obrigatórios estão faltando."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO fornecedores (nome, cnpj, telefone, endereco, email, estado, cidade, cep)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
            """, (
                data["nome"],
                data["cnpj"],
                data.get("telefone"),
                data.get("endereco"),
                data.get("email"),
                data["estado"],
                data["cidade"],
                data["cep"]
            ))
            fornecedor_id = cur.fetchone()[0]
            conn.commit()
        return jsonify({"message": "Fornecedor criado com sucesso.", "id": fornecedor_id}), 201
    except errors.UniqueViolation as e:
        conn.rollback()
        # Verifica se o erro é referente ao campo 'cnpj'
        if 'cnpj' in str(e):
            return jsonify({"error": "CNPJ já está cadastrado."}), 400
        return jsonify({"error": "Violação de chave única."}), 400
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/fornecedores/<int:id>", methods=["PUT"])
def atualizar_fornecedor(id):
    """Atualiza os dados de um fornecedor."""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE fornecedores
                SET nome = %s, cnpj = %s, telefone = %s, endereco = %s, email = %s, estado = %s, cidade = %s, cep = %s
                WHERE id = %s
            """, (
                data["nome"],
                data["cnpj"],
                data.get("telefone"),
                data.get("endereco"),
                data["email"],
                data["estado"],
                data["cidade"],
                data["cep"],
                id
            ))
            conn.commit()
        return jsonify({"message": "Fornecedor atualizado com sucesso."})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/fornecedores/<int:id>", methods=["DELETE"])
def excluir_fornecedor(id):
    """Exclui um fornecedor pelo ID."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM fornecedores WHERE id = %s", (id,))
            conn.commit()
        return jsonify({"message": "Fornecedor excluído com sucesso."})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
        
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

