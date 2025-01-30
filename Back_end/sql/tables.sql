CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,             
    codigo_barras VARCHAR(50) UNIQUE,       
    descricao TEXT,                         
    preco_custo NUMERIC(12, 2) NOT NULL,    
    custo_anterior NUMERIC(12, 2),          
    custo_medio NUMERIC(12, 2),             
    preco_venda NUMERIC(12, 2) NOT NULL,   
    margem NUMERIC(6, 2) GENERATED ALWAYS AS ((preco_venda - preco_custo) / preco_custo * 100) STORED, 
    categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL, 
    imagem BYTEA,
    classe_id INT REFERENCES classes(id) ON DELETE SET null,                          
    ativo BOOLEAN DEFAULT TRUE,             
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

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,          -- ID único para cada classe
    nome VARCHAR(255) NOT NULL,     -- Nome da classe (ex.: 350ML, 1L, etc.)
    descricao TEXT,                 -- Descrição adicional da classe (opcional)
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data de criação
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Data de atualização
);


CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,             -- Nome do fornecedor
    cnpj VARCHAR(20) UNIQUE NOT NULL,       -- CNPJ
    telefone VARCHAR(20),                   -- Telefone
    endereco TEXT,                          -- Endereço
    email VARCHAR(255),                     -- Email para contato
    estado VARCHAR(2),                      -- Estado
    cidade VARCHAR(100),
    cep VARCHAR(8)                    -- Cidade
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

-- Atualizar a tabela 'entradas' para incluir a filial
CREATE TABLE entradas (
    id SERIAL PRIMARY KEY,
    fornecedor_id INT REFERENCES fornecedores(id) ON DELETE CASCADE, -- Relacionado ao fornecedor
    filial_id INT REFERENCES filiais(id) ON DELETE CASCADE, -- Relacionado à filial
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data da entrada
    total NUMERIC(12, 2) NOT NULL, -- Total da entrada
    observacoes TEXT, -- Observações opcionais
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Atualizar a tabela 'itens_entrada' para incluir a filial
CREATE TABLE itens_entrada (
    id SERIAL PRIMARY KEY,
    entrada_id INT REFERENCES entradas(id) ON DELETE CASCADE, -- Relacionado à entrada
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE, -- Relacionado ao produto
    fornecedor_id INT REFERENCES fornecedores(id) ON DELETE SET NULL, -- Relacionado ao fornecedor
    filial_id INT REFERENCES filiais(id) ON DELETE CASCADE, -- Relacionado à filial
    quantidade INTEGER NOT NULL, -- Quantidade adquirida
    preco_custo NUMERIC(12, 2) NOT NULL, -- Preço de custo do produto na entrada
    subtotal NUMERIC(12, 2) GENERATED ALWAYS AS (quantidade * preco_custo) STORED -- Subtotal calculado
);
