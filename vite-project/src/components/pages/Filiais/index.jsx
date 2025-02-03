import React, { useState, useEffect } from "react";
import {
    AddProductForm,
    Input,
    ModalContainer,
    ModalContent,
    TableContainer,
} from "./styles";
import {
    Container,
    Button,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    ActionIcon,
    Select,
} from '../../../styles/utils'
import InputMask from "react-input-mask";
import { Notification } from "../../../styles/utils";
const estadosBrasil = [
    { sigla: "AC", nome: "Acre" },
    { sigla: "AL", nome: "Alagoas" },
    { sigla: "AP", nome: "Amapá" },
    { sigla: "AM", nome: "Amazonas" },
    { sigla: "BA", nome: "Bahia" },
    { sigla: "CE", nome: "Ceará" },
    { sigla: "DF", nome: "Distrito Federal" },
    { sigla: "ES", nome: "Espírito Santo" },
    { sigla: "GO", nome: "Goiás" },
    { sigla: "MA", nome: "Maranhão" },
    { sigla: "MT", nome: "Mato Grosso" },
    { sigla: "MS", nome: "Mato Grosso do Sul" },
    { sigla: "MG", nome: "Minas Gerais" },
    { sigla: "PA", nome: "Pará" },
    { sigla: "PB", nome: "Paraíba" },
    { sigla: "PR", nome: "Paraná" },
    { sigla: "PE", nome: "Pernambuco" },
    { sigla: "PI", nome: "Piauí" },
    { sigla: "RJ", nome: "Rio de Janeiro" },
    { sigla: "RN", nome: "Rio Grande do Norte" },
    { sigla: "RS", nome: "Rio Grande do Sul" },
    { sigla: "RO", nome: "Rondônia" },
    { sigla: "RR", nome: "Roraima" },
    { sigla: "SC", nome: "Santa Catarina" },
    { sigla: "SP", nome: "São Paulo" },
    { sigla: "SE", nome: "Sergipe" },
    { sigla: "TO", nome: "Tocantins" },
];

import api from '../../../api'
import { FaCheckCircle, FaEdit, FaExclamationCircle, FaTrash } from "react-icons/fa";

const Filiais = () => {
    const [filiais, setFiliais] = useState([]);
    const [message, setMessage] = useState(null); // Objeto { text, type }
    const [formData, setFormData] = useState({
        nome: "",
        codigo: "",
        telefone: "",
        endereco: "",
        cidade: "",
        estado: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchFiliais();
    }, []);
    const removeMask = (value) => value.replace(/\D/g, "");

    const fetchFiliais = async () => {
        try {
            const response = await api.get("/filiais");
            setFiliais(response.data || []);
        } catch (error) {
            showMessage("Erro ao buscar filiais.", "error");
        }
    };

    const showMessage = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000); // Remove a mensagem após 3 segundos
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({
            nome: "",
            cnpj: "",
            telefone: "",
            cep: "",
            codigo: "",
            endereco: "",
            cidade: "",
            estado: ""
        });
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                nome: formData.nome,
                cnpj: removeMask(formData.cnpj),
                telefone: removeMask(formData.telefone),
                cep: removeMask(formData.cep),
                codigo: formData.codigo,
                endereco: formData.endereco,
                cidade: formData.cidade,
                estado: formData.estado
            };

            if (isEditing) {
                await api.put(`/filiais/${editId}`, formattedData);
                showMessage("Filial atualizada com sucesso!", "success");
            } else {
                await api.post("/filiais-cadastrar", formattedData);
                showMessage("Filial cadastrada com sucesso!", "success");
            }

            fetchFiliais();
            setShowModal(false);
        } catch (error) {
            showMessage("Erro ao salvar filial.", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/filiais/${id}`);
            showMessage("Filial excluída com sucesso!", "success");
            fetchFiliais();
        } catch (error) {
            showMessage("Erro ao excluir filial.", "error");
        }
    };

    const handleEdit = (filial) => {
        setIsEditing(true);
        setEditId(filial.id);
        setFormData(filial);
        setShowModal(true);
    };


    const formatCPF = (cpf) => {
        if (!cpf || cpf.length !== 11) return cpf; // Verifica se o CPF é válido
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };


    const formatPhone = (phone) => {
        if (!phone) return phone;

        // Remover caracteres não numéricos
        phone = phone.replace(/\D/g, "");

        // Formato para telefone fixo (ex: (44) 3222-1234)
        if (phone.length === 10) {
            return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        }

        // Formato para celular (ex: (44) 99897-1234)
        if (phone.length === 11) {
            return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }

        return phone; // Retorna o número sem formatação se não corresponder
    };

    const formatCEP = (cep) => {
        if (!cep || cep.length !== 8) return cep; // Verifica se o CEP é válido
        return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
    };

    return (
        <Container>
            {/* Notificação */}
            {message && (
                <Notification type={message.type}>
                    {message.type === "success" ? (
                        <FaCheckCircle size={20} />
                    ) : (
                        <FaExclamationCircle size={20} />
                    )}
                    {message.text}
                </Notification>
            )}

            <h1>Gestão de Filiais</h1>
            <Button onClick={() => setShowModal(true)}>Adicionar Filial</Button>

            {/* Tabela de Filiais */}
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>Número</TableHeader>
                            <TableHeader>Nome</TableHeader>
                            <TableHeader>CNPJ</TableHeader>
                            <TableHeader>CEP</TableHeader>
                            <TableHeader>Código</TableHeader>
                            <TableHeader>Telefone</TableHeader>
                            <TableHeader>Endereço</TableHeader>
                            <TableHeader>Cidade</TableHeader>
                            <TableHeader>Estado</TableHeader>
                            <TableHeader>Ações</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(filiais) && filiais.length > 0 ? (
                            filiais.map((filial) => (
                                <TableRow key={filial.id}>
                                    <TableCell>{filial.id}</TableCell>
                                    <TableCell>{filial.nome}</TableCell>
                                    <TableCell>{formatCPF(filial.cnpj)}</TableCell>
                                    <TableCell>{formatCEP(filial.cep)}</TableCell>
                                    <TableCell>{filial.codigo}</TableCell>
                                    <TableCell>{formatPhone(filial.telefone)}</TableCell>
                                    <TableCell>{filial.endereco}</TableCell>
                                    <TableCell>{filial.cidade}</TableCell>
                                    <TableCell>{filial.estado}</TableCell>
                                    <TableCell>
                                        <ActionIcon onClick={() => handleEdit(filial)}>
                                            <FaEdit size={16} style={{ color: "#FF9800" }} />
                                        </ActionIcon>
                                        <ActionIcon onClick={() => handleDelete(filial.id)}>
                                            <FaTrash size={16} style={{ color: "#f43f5e" }} />
                                        </ActionIcon>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8}>Nenhuma filial encontrada.</TableCell>
                            </TableRow>
                        )}
                    </tbody>
                </Table>
            </TableContainer>

            {/* Modal */}
            {showModal && (
                <ModalContainer>
                    <ModalContent>
                        <h2>{isEditing ? "Editar Filial" : "Adicionar Filial"}</h2>
                        <form onSubmit={handleSubmit}>
                            <AddProductForm>
                                <Input
                                    name="nome"
                                    placeholder="Nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    required
                                />
                                <InputMask
                                    mask={formData.cnpj && formData.cnpj.replace(/\D/g, "").length > 11 ? "99.999.999/9999-99" : "999.999.999-99"}
                                    value={formData.cnpj || ""} // Evita undefined
                                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                    alwaysShowMask={false} // Evita mostrar a máscara quando o campo está vazio
                                >
                                    {inputProps => <Input {...inputProps} name="cnpj" placeholder="CNPJ/CPF" required />}
                                </InputMask>


                                <InputMask
                                    mask="99999-999"
                                    value={formData.cep}
                                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                                    beforeMaskedStateChange={({ nextState }) => {
                                        return { ...nextState, value: nextState.value };
                                    }}
                                >
                                    {inputProps => <Input {...inputProps} name="cep" placeholder="CEP" required />}
                                </InputMask>

                                <Input
                                    name="codigo"
                                    placeholder="Código"
                                    value={formData.codigo}
                                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                                    required
                                />

                                <InputMask
                                    mask="(99) 99999-9999"
                                    value={formData.telefone}
                                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                    beforeMaskedStateChange={({ nextState }) => {
                                        return { ...nextState, value: nextState.value };
                                    }}
                                >
                                    {inputProps => <Input {...inputProps} name="telefone" placeholder="Telefone" required />}
                                </InputMask>

                                <Input
                                    name="endereco"
                                    placeholder="Endereço"
                                    value={formData.endereco}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="cidade"
                                    placeholder="Cidade"
                                    value={formData.cidade}
                                    onChange={handleInputChange}
                                />
                                <Select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>Selecione um estado</option>
                                    {estadosBrasil.map((estado) => (
                                        <option key={estado.sigla} value={estado.sigla}>
                                            {estado.nome} ({estado.sigla})
                                        </option>
                                    ))}
                                </Select>

                            </AddProductForm>
                            <Button type="submit">Salvar</Button>
                            <Button onClick={handleCloseModal}>Cancelar</Button>
                        </form>
                    </ModalContent>
                </ModalContainer>
            )}
        </Container>
    );
};

export default Filiais;
