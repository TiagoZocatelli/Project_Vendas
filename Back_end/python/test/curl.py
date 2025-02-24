import bcrypt
import psycopg2

def get_db_connection():
    return psycopg2.connect(
        dbname="tzsystem",
        user="postgres",
        password="senha1",
        host="localhost",
        port="5432"
    )

def criar_filial_padrao():
    """Cria a filial padrão 'zk zk sistema' caso ainda não exista."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO filiais (nome, codigo, cnpj, telefone, cep, endereco, cidade, estado)
                VALUES ('zk zk sistema', 'ZK001', '00.000.000/0000-00', '0000000000', 
                        '00000-000', 'Endereço Padrão', 'Cidade Padrão', 'SP')
                ON CONFLICT (codigo) DO NOTHING 
                RETURNING id
                """
            )
            filial_id = cur.fetchone()
            conn.commit()
            
            if filial_id:
                print(f"✅ Filial criada com sucesso! ID: {filial_id[0]}")
                return filial_id[0]
            else:
                cur.execute("SELECT id FROM filiais WHERE codigo = 'ZK001'")
                filial_id = cur.fetchone()[0]
                print(f"🔹 Filial já existe. ID: {filial_id}")
                return filial_id
    except Exception as e:
        conn.rollback()
        print(f"❌ Erro ao criar filial: {str(e)}")
        return None
    finally:
        conn.close()

def criar_nivel_acesso_padrao():
    """Cria os níveis de acesso padrão caso ainda não existam."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO niveis_acesso (nivel) 
                VALUES ('Administrador')
                ON CONFLICT (nivel) DO NOTHING 
                RETURNING id
                """
            )
            nivel_id = cur.fetchone()
            conn.commit()

            if nivel_id:
                print(f"✅ Nível de acesso 'Administrador' criado! ID: {nivel_id[0]}")
                return nivel_id[0]
            else:
                cur.execute("SELECT id FROM niveis_acesso WHERE nivel = 'Administrador'")
                nivel_id = cur.fetchone()[0]
                print(f"🔹 Nível de acesso já existe. ID: {nivel_id}")
                return nivel_id
    except Exception as e:
        conn.rollback()
        print(f"❌ Erro ao criar nível de acesso: {str(e)}")
        return None
    finally:
        conn.close()

def inserir_usuario(nome, cpf, email, senha, filial_id, nivel_acesso_id):
    """Cria um usuário no banco de dados e vincula à filial e ao nível de acesso."""
    senha_hash = bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO usuarios (nome, cpf, email, senha, filial_id, nivel_acesso_id) 
                VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
                """,
                (nome, cpf, email, senha_hash, filial_id, nivel_acesso_id)
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

if __name__ == "__main__":
    # Criar filial padrão e obter o ID
    filial_id = criar_filial_padrao()
    
    # Criar nível de acesso padrão e obter o ID
    nivel_acesso_id = criar_nivel_acesso_padrao()
    
    if filial_id and nivel_acesso_id:
        # Criar usuário suporte vinculado à filial padrão e nível de acesso Administrador
        usuario_id = inserir_usuario(
            nome="suporte",
            cpf="000.000.000-00",
            email="suporte@zkzksistema.com",
            senha="2025159951",
            filial_id=filial_id,
            nivel_acesso_id=nivel_acesso_id
        )

        if usuario_id:
            print(f"🚀 Usuário de suporte cadastrado com sucesso! ID: {usuario_id}")
        else:
            print("⚠️ Falha ao cadastrar o usuário de suporte.")
    else:
        print("⚠️ Não foi possível criar a filial e/ou nível de acesso. O usuário não será cadastrado.")
