from flask import Flask, request, jsonify
from psycopg2 import errors  
import psycopg2
import base64
from decimal import Decimal
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

@app.route("/filiais", methods=["GET"])
def listar_filiais():
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM filiais")
            filiais = cur.fetchall()
            colnames = [desc[0] for desc in cur.description]
            results = [dict(zip(colnames, row)) for row in filiais]
        return jsonify(results)  # Retorna os dados como JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/filiais-cadastrar", methods=["POST"])
def criar_filial():
    """Cria uma nova filial."""
    data = request.json
    if not data or "nome" not in data or "estado" not in data:
        return jsonify({"error": "Dados inválidos ou incompletos"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500

    try:
        with conn.cursor() as cur:
            if not data.get("codigo"):
                cur.execute("SELECT COUNT(*) FROM filiais")
                count = cur.fetchone()[0] + 1
                data["codigo"] = f"Filial {count}"

            cur.execute("""
                INSERT INTO filiais (nome, codigo, telefone, endereco, cidade, estado, ativo)
                VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id
            """, (
                data["nome"],
                data["codigo"],
                data.get("telefone"),
                data.get("endereco"),
                data.get("cidade"),
                data.get("estado"),
                data.get("ativo", True)
            ))
            filial_id = cur.fetchone()[0]
            conn.commit()
        return jsonify({"message": "Filial criada com sucesso.", "id": filial_id, "codigo": data["codigo"]}), 201
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
            cur.execute("""
                UPDATE filiais
                SET nome = %s, codigo = %s, telefone = %s, endereco = %s, cidade = %s, estado = %s, ativo = %s
                WHERE id = %s
            """, (
                data["nome"],
                data["codigo"],
                data.get("telefone"),
                data.get("endereco"),
                data.get("cidade"),
                data.get("estado"),
                data.get("ativo", True),  # Define como ativo por padrão se não for informado
                id
            ))
            conn.commit()
        return jsonify({"message": "Filial atualizada com sucesso."}), 200
    except Exception as e:
        conn.rollback()
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

            # Inserir o novo cliente
            cur.execute("""
                INSERT INTO clientes (nome, cpf_cnpj, endereco, telefone, email)
                VALUES (%s, %s, %s, %s, %s) RETURNING id
            """, (
                data["nome"],
                data["cpf_cnpj"],
                data.get("endereco"),
                data.get("telefone"),
                data.get("email")
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
    """Atualiza os dados de um cliente."""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            # Verificar se o CPF/CNPJ já está cadastrado em outro cliente
            cur.execute("SELECT id FROM clientes WHERE cpf_cnpj = %s AND id != %s", (data["cpf_cnpj"], id))
            if cur.fetchone():
                return jsonify({"error": "CPF/CNPJ já está cadastrado em outro cliente."}), 400

            # Atualizar os dados do cliente
            cur.execute("""
                UPDATE clientes
                SET nome = %s, cpf_cnpj = %s, endereco = %s, telefone = %s, email = %s
                WHERE id = %s
            """, (
                data["nome"],
                data["cpf_cnpj"],
                data.get("endereco"),
                data.get("telefone"),
                data.get("email"),
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
            # Adicionar a entrada na tabela 'entradas'
            cur.execute("""
                INSERT INTO entradas (fornecedor_id, total, observacoes, filial_id)
                VALUES (%s, %s, %s, %s) RETURNING id
            """, (
                data["fornecedor_id"],
                Decimal(data["total"]),
                data["observacoes"],
                data["filial_id"]
            ))
            
            entrada_id = cur.fetchone()[0]

            # Processar os itens da entrada
            for item in data["itens"]:
                produto_id = item["produto_id"]
                nova_quantidade = Decimal(item["quantidade"])
                novo_preco_custo = Decimal(item["preco_custo"])

                # Inserir o item na tabela itens_entrada
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
                
                # Atualizar o estoque
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

                # Obter a quantidade atual do estoque na filial
                cur.execute("""
                    SELECT quantidade
                    FROM estoque_filial
                    WHERE filial_id = %s AND produto_id = %s
                """, (data["filial_id"], produto_id))
                estoque = cur.fetchone()

                quantidade_atual = Decimal(estoque[0]) if estoque else Decimal(0)

                # Atualizar custos do produto
                cur.execute("""
                    SELECT preco_custo, custo_medio
                    FROM produtos
                    WHERE id = %s
                """, (produto_id,))
                produto = cur.fetchone()
                
                if produto:
                    custo_atual = Decimal(produto[0])
                    custo_medio = Decimal(produto[1]) if produto[1] is not None else custo_atual

                    # Atualizar o custo médio
                    quantidade_total = quantidade_atual + nova_quantidade
                    novo_custo_medio = (
                        (custo_medio * quantidade_atual + novo_preco_custo * nova_quantidade)
                        / quantidade_total
                    )

                    # Mover custo atual para custo anterior e atualizar custo médio
                    cur.execute("""
                        UPDATE produtos
                        SET custo_anterior = preco_custo,
                            preco_custo = %s,
                            custo_medio = %s
                        WHERE id = %s
                    """, (novo_preco_custo, novo_custo_medio, produto_id))

            # Commit para salvar todas as alterações
            conn.commit()
        
        return jsonify({"message": "Entrada, itens e custos atualizados com sucesso."}), 201
    
    except Exception as e:
        print(e)
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

