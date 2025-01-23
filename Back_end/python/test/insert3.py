import requests

# URL da API
url = "http://localhost:5000/fornecedores"

# Dados a serem enviados
data = {
    "nome": "Fornecedor Exemplo",
    "cnpj": "12345678000199",
    "estado": "SP",
    "cidade": "São Paulo",
    "cep": "01001-000",
    "email": "exemplo@email.com",
    "telefone": "11999999999",
    "endereco": "Rua Exemplo, 123"
}

# Cabeçalhos
headers = {
    "Content-Type": "application/json"
}

# Enviar a requisição POST
response = requests.post(url, json=data, headers=headers)

# Exibir o resultado
if response.status_code == 201:
    print("Fornecedor criado com sucesso:", response.json())
elif response.status_code == 400:
    print("Erro na requisição:", response.json())
elif response.status_code == 500:
    print("Erro no servidor:", response.json())
else:
    print("Resposta inesperada:", response.status_code, response.text)
