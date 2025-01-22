from flask import Flask, request, jsonify
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
DB_CONFIG = {
    "host": "127.0.0.1",
    "database": "systemtz",
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
    """Lista todos os produtos."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM produtos")
            rows = cur.fetchall()
            if not rows:
                return jsonify([])  # Retorna lista vazia se não houver produtos
            colunas = [desc[0] for desc in cur.description]
            produtos = [dict(zip(colunas, row)) for row in rows]
        return jsonify(produtos)
    except Exception as e:
        print(f"Erro: {e}")  # Para ajudar na depuração
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/produtos", methods=["POST"])
def criar_produto():
    """Cria um novo produto."""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO produtos (nome, codigo_barras, preco_custo, preco_venda, estoque)
                VALUES (%s, %s, %s, %s, %s) RETURNING id
            """, (
                data["nome"],
                data.get("codigo_barras"),
                data["preco_custo"],
                data["preco_venda"],
                data.get("estoque", 0)
            ))
            produto_id = cur.fetchone()[0]
            conn.commit()
        return jsonify({"message": "Produto criado com sucesso.", "id": produto_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/produtos/<int:id>", methods=["PUT"])
def atualizar_produto(id):
    """Atualiza os dados de um produto."""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE produtos
                SET nome = %s, codigo_barras = %s, preco_custo = %s, preco_venda = %s, estoque = %s
                WHERE id = %s
            """, (
                data["nome"],
                data.get("codigo_barras"),
                data["preco_custo"],
                data["preco_venda"],
                data.get("estoque", 0),
                id
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
    """Retorna todas as entradas e seus respectivos itens, incluindo o nome do fornecedor."""
    conn = get_db_connection()
    
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    
    try:
        with conn.cursor() as cur:
            # Busca todas as entradas junto com o nome do fornecedor
            cur.execute("""
                SELECT 
                    e.id AS entrada_id,
                    e.fornecedor_id,
                    f.nome AS fornecedor_nome,
                    e.data_entrada,
                    e.total,
                    e.observacoes,
                    e.criado_em,
                    e.atualizado_em
                FROM entradas e
                JOIN fornecedores f ON e.fornecedor_id = f.id
            """)
            entradas = cur.fetchall()

            # Para cada entrada, buscar os itens relacionados
            entradas_com_itens = []
            for entrada in entradas:
                cur.execute("""
                    SELECT 
                        id,
                        entrada_id,
                        produto_id,
                        quantidade,
                        preco_custo,
                        subtotal
                    FROM itens_entrada
                    WHERE entrada_id = %s
                """, (entrada[0],))  # entrada_id
                itens = cur.fetchall()

                # Construindo a resposta detalhada
                entradas_com_itens.append({
                    "entrada": {
                        "id": entrada[0],  # ID da entrada
                        "fornecedor_id": entrada[1],  # ID do fornecedor
                        "fornecedor_nome": entrada[2],  # Nome do fornecedor
                        "data_entrada": entrada[3],  # Data de entrada
                        "total": entrada[4],  # Total da entrada
                        "observacoes": entrada[5],  # Observações associadas à entrada
                        "criado_em": entrada[6],  # Data de criação do registro
                        "atualizado_em": entrada[7],  # Data de última atualização
                    },
                    "itens": [
                        {
                            "id": item[0],  # ID do item
                            "entrada_id": item[1],  # ID da entrada à qual o item pertence
                            "produto_id": item[2],  # ID do produto relacionado ao item
                            "quantidade": item[3],  # Quantidade do produto no item
                            "preco_custo": item[4],  # Preço de custo do produto
                            "subtotal": item[5],  # Subtotal do item (quantidade * preço de custo)
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
            # Adicionar a entrada na tabela 'entradas' com fornecedor_id
            cur.execute("""
                INSERT INTO entradas (fornecedor_id, total, observacoes)
                VALUES (%s, %s, %s) RETURNING id
            """, (
                data["fornecedor_id"],  # fornecedor_id
                data["total"],  # total da entrada
                data["observacoes"]  # observações
            ))
            
            # Pega o id da entrada recém-criada
            entrada_id = cur.fetchone()[0]
            
            # Agora adiciona os itens dessa entrada
            for item in data["itens"]:  # "itens" é uma lista de itens no corpo da requisição
                cur.execute("""
                    INSERT INTO itens_entrada (entrada_id, produto_id, quantidade, preco_custo, fornecedor_id)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    entrada_id,
                    item["produto_id"],
                    item["quantidade"],
                    item["preco_custo"],
                    data["fornecedor_id"]  # Adicionando o fornecedor_id nos itens
                ))
                
                # Atualiza o estoque do produto
                cur.execute("""
                    UPDATE produtos
                    SET estoque = estoque + %s
                    WHERE id = %s
                """, (
                    item["quantidade"],
                    item["produto_id"]
                ))

            # Commit para salvar tudo no banco
            conn.commit()
        
        return jsonify({"message": "Entrada e itens adicionados com sucesso."}), 201
    
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    
    finally:
        conn.close()

@app.route("/itens_entrada/<int:id>", methods=["DELETE"])
def excluir_item_entrada(id):
    """Exclui um item de entrada e atualiza o estoque do produto."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco."}), 500
    try:
        with conn.cursor() as cur:
            # Buscar a quantidade e o produto associado ao item antes de excluir
            cur.execute("SELECT produto_id, quantidade FROM itens_entrada WHERE id = %s", (id,))
            item = cur.fetchone()
            if not item:
                return jsonify({"error": "Item não encontrado."}), 404

            produto_id, quantidade = item

            # Excluir o item da tabela itens_entrada
            cur.execute("DELETE FROM itens_entrada WHERE id = %s", (id,))

            # Atualizar o estoque do produto
            cur.execute("""
                UPDATE produtos
                SET estoque = estoque - %s
                WHERE id = %s
            """, (
                quantidade,
                produto_id
            ))
            conn.commit()
        return jsonify({"message": "Item excluído e estoque atualizado com sucesso."})
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
            # Buscar todos os itens associados à entrada
            cur.execute("SELECT produto_id, quantidade FROM itens_entrada WHERE entrada_id = %s", (id,))
            itens = cur.fetchall()
            if not itens:
                return jsonify({"error": "Nenhum item encontrado para esta entrada."}), 404

            # Ajustar o estoque dos produtos
            for produto_id, quantidade in itens:
                cur.execute("""
                    UPDATE produtos
                    SET estoque = estoque - %s
                    WHERE id = %s
                """, (
                    quantidade,
                    produto_id
                ))

            # Excluir todos os itens associados à entrada
            cur.execute("DELETE FROM itens_entrada WHERE entrada_id = %s", (id,))

            # Excluir a entrada
            cur.execute("DELETE FROM entradas WHERE id = %s", (id,))
            conn.commit()
        return jsonify({"message": "Entrada cancelada e estoque ajustado com sucesso."})
    except Exception as e:
        conn.rollback()
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

# =================== Inicialização ===================
if __name__ == "__main__":
    app.run(port=5000, debug=True)
