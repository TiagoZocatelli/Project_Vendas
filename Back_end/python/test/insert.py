import psycopg2
from psycopg2 import sql

# Configuração do banco de dados
DB_CONFIG = {
    "host": "127.0.0.1",
    "database": "systemtz",
    "user": "postgres",
    "password": "senha1",
    "port": 5432,
}

try:
    # Conectar ao banco de dados
    conn = psycopg2.connect(**DB_CONFIG)
    conn.set_client_encoding('UTF8')  # Define o encoding para UTF-8
    cursor = conn.cursor()

    # Inserir 100 produtos
    for i in range(1, 101):  # Itera de 1 a 100
        produto = {
            "nome": f"Produto {i}",
            "codigo_barras": f"1234567890{i:03d}",  # Código de barras único
            "descricao": f"Descrição do Produto {i} com caracteres especiais: ç, é, à.",
            "preco_custo": round(10 + i * 0.5, 2),  # Preço de custo variável
            "preco_venda": round(15 + i * 0.7, 2),  # Preço de venda variável
            "estoque": i * 2,  # Estoque variável
        }

        # Query de inserção
        insert_query = sql.SQL("""
            INSERT INTO produtos (nome, codigo_barras, descricao, preco_custo, preco_venda, estoque)
            VALUES (%s, %s, %s, %s, %s, %s)
        """)
        cursor.execute(insert_query, (
            produto["nome"],
            produto["codigo_barras"],
            produto["descricao"],
            produto["preco_custo"],
            produto["preco_venda"],
            produto["estoque"],
        ))

    # Commit para salvar todas as transações
    conn.commit()
    print("100 produtos inseridos com sucesso!")

except psycopg2.Error as e:
    print(f"Erro ao inserir produtos: {e}")
finally:
    # Fechar a conexão
    if conn:
        cursor.close()
        conn.close()
