import bcrypt
import psycopg2

# Função para conectar ao banco de dados
def get_db_connection():
    return psycopg2.connect(
        dbname="tzsystem",
        user="postgres",
        password="senha1",
        host="localhost",
        port="5432"
    )

# 🔹 Função para inserir usuário diretamente no banco
def inserir_usuario(nome, cpf, email, senha, cargo, filial_id, nivel_acesso_id):
    senha_hash = bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO usuarios (nome, cpf, email, senha, cargo, filial_id, nivel_acesso_id) 
                VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id
                """,
                (nome, cpf, email, senha_hash, cargo, filial_id, nivel_acesso_id)
            )
            usuario_id = cur.fetchone()[0]
            conn.commit()
            print(f"✅ Usuário inserido com sucesso! ID: {usuario_id}")
            return usuario_id
    except Exception as e:
        conn.rollback()
        print(f"❌ Erro ao cadastrar usuário: {str(e)}")
        return None
    finally:
        conn.close()

# 📌 Criar Usuário "Suporte" diretamente no banco de dados
if __name__ == "__main__":
    usuario_id = inserir_usuario(
        nome="Suporte",
        cpf="000.000.000-00",
        email="teste@teste.com",
        senha="zksistemas2025",
        cargo="Administrador",
        filial_id=1,  # Defina um ID válido da filial
        nivel_acesso_id=1  # Defina um nível de acesso válido
    )

    if usuario_id:
        print(f"🚀 Usuário cadastrado com sucesso! ID: {usuario_id}")
    else:
        print("⚠️ Falha ao cadastrar o usuário.")
