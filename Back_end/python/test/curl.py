import requests

# URL do endpoint para atualização de imagem
url = "http://localhost:5000/produtos/3/imagem"

# Caminho para o arquivo de imagem (certifique-se de que o caminho está correto)
file_path = r"C:\Users\Tiago\Downloads\coca.png"

# Abrindo o arquivo de imagem e enviando a requisição
try:
    with open(file_path, "rb") as file:
        # Configurando os dados para enviar no campo 'imagem'
        files = {"imagem": file}

        # Realizando a requisição PUT
        response = requests.put(url, files=files)

        # Exibindo o status e a resposta do servidor
        print("Status Code:", response.status_code)
        print("Resposta:", response.json())

except FileNotFoundError:
    print(f"Erro: Arquivo não encontrado no caminho especificado: {file_path}")
except Exception as e:
    print(f"Erro ao enviar a requisição: {e}")
