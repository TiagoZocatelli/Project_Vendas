import psycopg2
import random
from datetime import datetime, timedelta
from flask_jwt_extended import JWTManager, create_access_token

# Configuração do Banco de Dados
DB_CONFIG = {
    "host": "127.0.0.1",
    "database": "tzsystem",
    "user": "postgres",
    "password": "senha1",
    "port": 5432
}

# Função para conectar ao banco de dados
def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao banco: {e}")
        return None
    
    
# -------------------------------
# 📌 Inserir Operadores
# -------------------------------
def inserir_operadores():
    operadores = [
        ("João Silva", "123.456.789-00", "joao@email.com", "senha123", "Gerente"),
        ("Maria Souza", "987.654.321-00", "maria@email.com", "senha456", "Caixa"),
        ("Carlos Santos", "321.654.987-00", "carlos@email.com", "senha789", "Vendedor")
    ]
    conn = get_db_connection()
    with conn.cursor() as cur:
        for operador in operadores:
            cur.execute("INSERT INTO operadores (nome, cpf, email, senha, cargo) VALUES (%s, %s, %s, %s, %s)", operador)
        conn.commit()
    conn.close()
    print("✅ Operadores inseridos!")

# -------------------------------
# 📌 Inserir Produtos
# -------------------------------
def inserir_produtos():
    produtos = [
        ("Coca-Cola 2L", "7891000100101", "Refrigerante de 2L", 4.50, 5.99),
        ("Arroz 5kg", "7896004000018", "Arroz Tipo 1 - Pacote 5kg", 15.00, 19.99),
        ("Óleo de Soja 900ml", "7891234567890", "Óleo de Soja Refinado", 6.50, 8.99)
    ]
    conn = get_db_connection()
    with conn.cursor() as cur:
        for produto in produtos:
            cur.execute("INSERT INTO produtos (nome, codigo_barras, descricao, preco_custo, preco_venda) VALUES (%s, %s, %s, %s, %s)", produto)
        conn.commit()
    conn.close()
    print("✅ Produtos inseridos!")

# -------------------------------
# 📌 Inserir Ofertas
# -------------------------------
def inserir_ofertas():
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM produtos")
        produtos = cur.fetchall()
        
        for produto_id in produtos:
            desconto = random.choice([5.00, 10.00, 15.00])
            tipo = "percentual"
            data_inicio = datetime.now()
            data_fim = data_inicio + timedelta(days=random.randint(5, 15))

            cur.execute("INSERT INTO ofertas (produto_id, tipo, valor, data_inicio, data_fim) VALUES (%s, %s, %s, %s, %s)",
                        (produto_id[0], tipo, desconto, data_inicio, data_fim))
        conn.commit()
    conn.close()
    print("✅ Ofertas inseridas!")

# -------------------------------
# 📌 Inserir Pedidos
# -------------------------------
def inserir_pedidos():
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM operadores")
        operadores = cur.fetchall()
        
        for _ in range(3):  # Criando 3 pedidos
            operador_id = random.choice(operadores)[0]
            cliente = f"Cliente {random.randint(1, 100)}"
            total = round(random.uniform(30, 200), 2)

            cur.execute("INSERT INTO pedidos (cliente, operador_id, total) VALUES (%s, %s, %s) RETURNING id",
                        (cliente, operador_id, total))
        conn.commit()
    conn.close()
    print("✅ Pedidos inseridos!")

# -------------------------------
# 📌 Inserir Vendas
# -------------------------------
def inserir_vendas():
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM operadores")
        operadores = cur.fetchall()

        cur.execute("SELECT id FROM produtos")
        produtos = cur.fetchall()

        for _ in range(3):  # Criando 3 vendas sem pedido
            operador_id = random.choice(operadores)[0]
            cliente = f"Cliente {random.randint(1, 100)}"
            total = round(random.uniform(50, 500), 2)

            cur.execute("INSERT INTO vendas (operador_id, cliente, total) VALUES (%s, %s, %s) RETURNING id",
                        (operador_id, cliente, total))
            venda_id = cur.fetchone()[0]

            # Adicionando 2 produtos à venda
            for _ in range(2):
                produto_id = random.choice(produtos)[0]
                quantidade = random.randint(1, 5)
                preco_unitario = round(random.uniform(5, 50), 2)
                desconto = round(random.uniform(0, 10), 2)
                total_item = (quantidade * preco_unitario) - desconto

                cur.execute("INSERT INTO vendas_itens (venda_id, produto_id, quantidade, preco_unitario, desconto, total) VALUES (%s, %s, %s, %s, %s, %s)",
                            (venda_id, produto_id, quantidade, preco_unitario, desconto, total_item))

        conn.commit()
    conn.close()
    print("✅ Vendas inseridas!")

# -------------------------------
# 🚀 Executar Funções
# -------------------------------
if __name__ == "__main__":
    inserir_operadores()
    inserir_produtos()
    inserir_ofertas()
    inserir_pedidos()
    inserir_vendas()
    print("\n🎉 Todos os dados foram inseridos com sucesso!")
