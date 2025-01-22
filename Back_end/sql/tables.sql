CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo_barras VARCHAR(50) UNIQUE,
    descricao TEXT,
    preco_custo NUMERIC(12, 2) NOT NULL,
    preco_venda NUMERIC(12, 2) NOT NULL,
    margem NUMERIC(6, 2) GENERATED ALWAYS AS ((preco_venda - preco_custo) / preco_custo * 100) STORED,
    estoque INTEGER NOT NULL DEFAULT 0,
    estoque_minimo INTEGER DEFAULT 0,
    categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL,
    fornecedor_id INT REFERENCES fornecedores(id) ON DELETE SET NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT
);

CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,         -- Nome do fornecedor
    cnpj VARCHAR(20) UNIQUE NOT NULL,  -- CNPJ do fornecedor
    telefone VARCHAR(20),              -- Telefone
    endereco TEXT,                     -- Endereço completo
    email VARCHAR(255),                -- Email para contato
    estado VARCHAR(2),                 -- Sigla do estado (ex: SP, RJ)
    cidade VARCHAR(100),               -- Nome da cidade
    cep VARCHAR(10),                   -- Código postal (CEP)
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Data de criação
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Última atualização
);


CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(18) UNIQUE, -- CPF ou CNPJ, formato: 000.000.000-00 ou 00.000.000/0000-00
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    ativo BOOLEAN DEFAULT TRUE, -- Status do cliente
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entradas (
    id SERIAL PRIMARY KEY,
    fornecedor_id INT REFERENCES fornecedores(id) ON DELETE CASCADE, -- Relacionado ao fornecedor
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data da entrada
    total NUMERIC(12, 2) NOT NULL, -- Total da entrada
    observacoes TEXT, -- Observações opcionais
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itens_entrada (
    id SERIAL PRIMARY KEY,
    entrada_id INT REFERENCES entradas(id) ON DELETE CASCADE, -- Relacionado à entrada
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE, -- Relacionado ao produto
    fornecedor_id INT REFERENCES fornecedores(id) ON DELETE SET NULL, -- Relacionado ao fornecedor
    quantidade INTEGER NOT NULL, -- Quantidade adquirida
    preco_custo NUMERIC(12, 2) NOT NULL, -- Preço de custo do produto na entrada
    subtotal NUMERIC(12, 2) GENERATED ALWAYS AS (quantidade * preco_custo) STORED -- Subtotal calculado
);
