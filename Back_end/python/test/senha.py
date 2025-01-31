import psycopg2
import bcrypt

DB_CONFIG = {
    "host": "127.0.0.1",
    "database": "tzsystem",
    "user": "postgres",
    "password": "senha1",
    "port": 5432
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

def hash_and_update_passwords():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, senha FROM operadores")  # Pegamos todas as senhas em texto puro
    operadores = cur.fetchall()

    for operador_id, senha in operadores:
        if not senha.startswith("$2b$"):  # Apenas criptografa se ainda estiver em texto puro
            senha_hash = bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            cur.execute("UPDATE operadores SET senha = %s WHERE id = %s", (senha_hash, operador_id))

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Senhas atualizadas com sucesso!")

hash_and_update_passwords()
