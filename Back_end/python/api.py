from flask import Flask, request, jsonify
import psycopg2
import base64
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
    """Lista todos os produtos com os estoques por filial, imagem e nome da categoria.""" 
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            # Consulta para buscar os produtos, estoques, e nome da categoria
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
                    p.ativo,
                    p.criado_em,
                    p.atualizado_em,
                    ef.filial_id,
                    ef.quantidade,
                    ef.estoque_minimo,
                    p.imagem  -- Adiciona a imagem
                FROM produtos p
                LEFT JOIN estoque_filial ef ON p.id = ef.produto_id
                LEFT JOIN categorias c ON p.categoria_id = c.id -- Junção com a tabela de categorias
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
                        "categoria_nome": row_dict["categoria_nome"],  # Adiciona o nome da categoria
                        "ativo": row_dict["ativo"],
                        "criado_em": row_dict["criado_em"],
                        "atualizado_em": row_dict["atualizado_em"],
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

@app.route("/produtos", methods=["POST"])
def criar_produto():
    """Cria um novo produto e define o estoque por filial."""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            # Inserir o produto na tabela `produtos`
            cur.execute("""
                INSERT INTO produtos (nome, codigo_barras, preco_custo, preco_venda, categoria_id)
                VALUES (%s, %s, %s, %s, %s) RETURNING id
            """, (
                data["nome"],
                data.get("codigo_barras"),
                data["preco_custo"],
                data["preco_venda"],
                data.get("categoria_id")  # `categoria_id` deve ser incluído no corpo da requisição
            ))
            produto_id = cur.fetchone()[0]

            # Inserir o estoque inicial por filial
            for filial in data.get("estoques", []):  # `estoques` é uma lista de objetos com filial_id e quantidade
                cur.execute("""
                    INSERT INTO estoque_filial (filial_id, produto_id, quantidade, estoque_minimo)
                    VALUES (%s, %s, %s, %s)
                """, (
                    filial["filial_id"],
                    produto_id,
                    filial.get("quantidade", 0),
                    filial.get("estoque_minimo", 0)
                ))

            conn.commit()
        return jsonify({"message": "Produto criado com sucesso.", "id": produto_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/produtos/<int:id>", methods=["PUT"])
def atualizar_produto(id):
    """Atualiza os dados de um produto e seus estoques por filial."""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            # Atualizar os dados do produto
            cur.execute("""
                UPDATE produtos
                SET nome = %s, codigo_barras = %s, preco_custo = %s, preco_venda = %s, categoria_id = %s
                WHERE id = %s
            """, (
                data["nome"],
                data.get("codigo_barras"),
                data["preco_custo"],
                data["preco_venda"],
                data.get("categoria_id"),  # Atualizar a categoria do produto
                id
            ))

            # Atualizar ou inserir os estoques por filial
            for filial in data.get("estoques", []):  # `estoques` é uma lista de objetos com filial_id e quantidade
                cur.execute("""
                    INSERT INTO estoque_filial (filial_id, produto_id, quantidade, estoque_minimo)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (filial_id, produto_id) DO UPDATE
                    SET quantidade = EXCLUDED.quantidade,
                        estoque_minimo = EXCLUDED.estoque_minimo
                """, (
                    filial["filial_id"],
                    id,
                    filial.get("quantidade", 0),
                    filial.get("estoque_minimo", 0)
                ))

            conn.commit()
        return jsonify({"message": "Produto atualizado com sucesso."})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/produtos/<int:id>", methods=["DELETE"])
def excluir_produto(id):
    """Exclui um produto pelo ID."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM produtos WHERE id = %s", (id,))
            conn.commit()
        return jsonify({"message": "Produto excluído com sucesso."})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

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
    """Cria uma nova entrada e adiciona os itens relacionados."""
    data = request.json
    conn = get_db_connection()
    
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    
    try:
        with conn.cursor() as cur:
            # Adicionar a entrada na tabela 'entradas' com fornecedor_id e filial_id
            cur.execute("""
                INSERT INTO entradas (fornecedor_id, total, observacoes, filial_id)
                VALUES (%s, %s, %s, %s) RETURNING id
            """, (
                data["fornecedor_id"],
                data["total"],
                data["observacoes"],
                data["filial_id"]  # Incluindo filial_id
            ))
            
            # Pega o id da entrada recém-criada
            entrada_id = cur.fetchone()[0]
            
            # Agora adiciona os itens dessa entrada
            for item in data["itens"]:
                cur.execute("""
                    INSERT INTO itens_entrada (entrada_id, produto_id, quantidade, preco_custo, fornecedor_id, filial_id)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    entrada_id,
                    item["produto_id"],
                    item["quantidade"],
                    item["preco_custo"],
                    data["fornecedor_id"],
                    data["filial_id"]  # Incluindo filial_id nos itens
                ))
                
                # Atualiza o estoque do produto na tabela estoque_filial
                cur.execute("""
                    INSERT INTO estoque_filial (filial_id, produto_id, quantidade)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (filial_id, produto_id)
                    DO UPDATE SET quantidade = estoque_filial.quantidade + EXCLUDED.quantidade
                """, (
                    data["filial_id"],
                    item["produto_id"],
                    item["quantidade"]
                ))

            # Commit para salvar tudo no banco
            conn.commit()
        
        return jsonify({"message": "Entrada e itens adicionados com sucesso."}), 201
    
    except Exception as e:
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

            if not itens:
                return jsonify({"error": "Nenhum item encontrado para esta entrada."}), 404

            # Ajustar o estoque dos produtos
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

            # Excluir a entrada
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
                data["email"],
                data["estado"],
                data["cidade"],
                data["cep"]
            ))
            fornecedor_id = cur.fetchone()[0]
            conn.commit()
        return jsonify({"message": "Fornecedor criado com sucesso.", "id": fornecedor_id}), 201
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

