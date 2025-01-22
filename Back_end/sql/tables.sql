CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,             -- Nome do produto
    codigo_barras VARCHAR(50) UNIQUE,       -- Código de barras único
    descricao TEXT,                         -- Descrição do produto
    preco_custo NUMERIC(12, 2) NOT NULL,    -- Preço de custo (valor médio ou principal)
    preco_venda NUMERIC(12, 2) NOT NULL,    -- Preço de venda
    margem NUMERIC(6, 2) GENERATED ALWAYS AS ((preco_venda - preco_custo) / preco_custo * 100) STORED, -- Margem de lucro
    categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL, -- Categoria
    ativo BOOLEAN DEFAULT TRUE,             -- Status do produto
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE estoque_filial (
    id SERIAL PRIMARY KEY,
    filial_id INT REFERENCES filiais(id) ON DELETE CASCADE, -- Relacionado à filial
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE, -- Relacionado ao produto
    quantidade INTEGER NOT NULL DEFAULT 0,                  -- Quantidade em estoque
    estoque_minimo INTEGER DEFAULT 0,                       -- Estoque mínimo
    UNIQUE (filial_id, produto_id)                          -- Garante que não haja duplicação
);


CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT
);

CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,             -- Nome do fornecedor
    cnpj VARCHAR(20) UNIQUE NOT NULL,       -- CNPJ
    telefone VARCHAR(20),                   -- Telefone
    endereco TEXT,                          -- Endereço
    email VARCHAR(255),                     -- Email para contato
    estado VARCHAR(2),                      -- Estado
    cidade VARCHAR(100),                    -- Cidade
    ativo BOOLEAN DEFAULT TRUE,             -- Status do fornecedor
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE produto_fornecedores (
    id SERIAL PRIMARY KEY,
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE, -- Produto
    fornecedor_id INT REFERENCES fornecedores(id) ON DELETE CASCADE, -- Fornecedor
    preco_custo NUMERIC(12, 2) NOT NULL, -- Preço de custo fornecido por este fornecedor
    prazo_entrega INTEGER DEFAULT 0,     -- Prazo de entrega em dias (opcional)
    UNIQUE (produto_id, fornecedor_id)   -- Garante que um fornecedor não esteja duplicado para o mesmo produto
);


CREATE TABLE filiais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,          -- Nome da filial
    codigo VARCHAR(20) UNIQUE NOT NULL, -- Código identificador da filial
    telefone VARCHAR(20),               -- Telefone da filial
    endereco TEXT,                      -- Endereço completo da filial
    cidade VARCHAR(100),                -- Cidade onde a filial está localizada
    estado VARCHAR(2),                  -- Sigla do estado (ex: SP, RJ)
    ativo BOOLEAN DEFAULT TRUE,         -- Status da filial
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
