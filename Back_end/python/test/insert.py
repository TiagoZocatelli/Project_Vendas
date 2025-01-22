import psycopg2
from psycopg2 import sql

# Configuração do banco de dados
DB_CONFIG = {
    "host": "127.0.0.1",
    "database": "tzsystem",
    "user": "postgres",
    "password": "senha1",
    "port": 5432,
}

try:
    # Conectar ao banco de dados
    conn = psycopg2.connect(**DB_CONFIG)
    conn.set_client_encoding('UTF8')  # Define o encoding para UTF-8
    cursor = conn.cursor()

    # Inserir 100 produtos com estoque em 3 filiais
    for i in range(1, 101):  # Itera de 1 a 100
        produto = {
            "nome": f"Produto {i}",
            "codigo_barras": f"1234567890{i:03d}",  # Código de barras único
            "descricao": f"Descrição do Produto {i} com caracteres especiais: ç, é, à.",
            "preco_custo": round(10 + i * 0.5, 2),  # Preço de custo variável
            "preco_venda": round(15 + i * 0.7, 2),  # Preço de venda variável
        }

        # Query de inserção do produto
        insert_produto_query = sql.SQL("""
            INSERT INTO produtos (nome, codigo_barras, descricao, preco_custo, preco_venda)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        """)
        cursor.execute(insert_produto_query, (
            produto["nome"],
            produto["codigo_barras"],
            produto["descricao"],
            produto["preco_custo"],
            produto["preco_venda"],
        ))

        # Obter o ID do produto recém-inserido
        produto_id = cursor.fetchone()[0]

        # Configurar estoques para 3 filiais (com IDs diferentes)
        filiais = [
            {"filial_id": 1, "quantidade": i * 2, "estoque_minimo": 5},
            {"filial_id": 1, "quantidade": i * 3, "estoque_minimo": 10},
            {"filial_id": 1, "quantidade": i * 4, "estoque_minimo": 15},
        ]

        # Query de inserção de estoque por filial com ON CONFLICT
        insert_estoque_query = sql.SQL("""
            INSERT INTO estoque_filial (filial_id, produto_id, quantidade, estoque_minimo)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (filial_id, produto_id) DO UPDATE
            SET quantidade = EXCLUDED.quantidade,
                estoque_minimo = EXCLUDED.estoque_minimo
        """)

        # Inserir estoques para cada filial
        for filial in filiais:
            cursor.execute(insert_estoque_query, (
                filial["filial_id"],
                produto_id,
                filial["quantidade"],
                filial["estoque_minimo"],
            ))

    # Commit para salvar todas as transações
    conn.commit()
    print("100 produtos e estoques inseridos com sucesso!")

except psycopg2.Error as e:
    print(f"Erro ao inserir produtos e estoques: {e}")
finally:
    # Fechar a conexão
    if conn:
        cursor.close()
        conn.close()
