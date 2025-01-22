import requests
import json

# URL da sua API
url = "http://localhost:5000/entradas-notas"

# Dados para inserir 10 registros de exemplo
entrada_data = {
    "fornecedor_id": 2,
    "total": 1000.00,
    "observacoes": "Exemplo de entrada com múltiplos itens",
    "itens": [
        {"produto_id": 1, "quantidade": 10, "preco_custo": 50.00},
        {"produto_id": 1, "quantidade": 5, "preco_custo": 30.00},
        {"produto_id": 1, "quantidade": 8, "preco_custo": 20.00},
        {"produto_id": 1, "quantidade": 12, "preco_custo": 15.00},
        {"produto_id": 1, "quantidade": 6, "preco_custo": 100.00},
        {"produto_id": 1, "quantidade": 3, "preco_custo": 60.00},
        {"produto_id": 1, "quantidade": 9, "preco_custo": 80.00},
        {"produto_id": 1, "quantidade": 7, "preco_custo": 40.00},
        {"produto_id": 1, "quantidade": 4, "preco_custo": 90.00},
        {"produto_id": 1, "quantidade": 5, "preco_custo": 120.00}
    ]
}

# Headers para informar que o corpo da requisição é JSON
headers = {
    'Content-Type': 'application/json'
}

# Fazendo a requisição POST
response = requests.post(url, headers=headers, data=json.dumps(entrada_data))

# Verificando a resposta da API
if response.status_code == 201:
    print("Entradas adicionadas com sucesso!")
    print(response.json())
else:
    print(f"Erro ao adicionar entradas: {response.status_code}")
    print(response.json())
