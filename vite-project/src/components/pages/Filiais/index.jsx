import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Button,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TableContainer,
    AddProductForm,
    Input,
    ModalContainer,
    ModalContent,
} from "./styles";

import api from '../../../api'

const Filiais = () => {
    const [filiais, setFiliais] = useState([]);
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

    // Carrega as filiais ao carregar a página
    useEffect(() => {
        fetchFiliais();
    }, []);

    const fetchFiliais = async () => {
        try {
            const response = await api.get("/filiais"); // Usa a baseURL configurada
            setFiliais(response.data || []);
        } catch (error) {
            console.error("Erro ao buscar filiais:", error);
            setFiliais([]);
        }
    };





    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/filiais/${editId}`, formData);
            } else {
                await api.post("/filiais-cadastrar", formData); // Caminho correto
            }
            fetchFiliais();
            setFormData({
                nome: "",
                codigo: "",
                telefone: "",
                endereco: "",
                cidade: "",
                estado: "",
            });
            setShowModal(false);
        } catch (error) {
            console.error("Erro ao salvar filial:", error);
        }
    };


    const handleDelete = async (id) => {
        try {
            await api.delete(`/filiais/${id}`); // Usa a instância configurada com baseURL
            fetchFiliais(); // Atualiza a lista após a exclusão
        } catch (error) {
            console.error("Erro ao excluir filial:", error);
        }
    };
    


    const handleEdit = (filial) => {
        setIsEditing(true);
        setEditId(filial.id);
        setFormData(filial);
        setShowModal(true);
    };

    return (
        <Container>
            <h1>Gestão de Filiais</h1>
            <Button onClick={() => setShowModal(true)}>Adicionar Filial</Button>

            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>Número</TableHeader>
                            <TableHeader>Nome</TableHeader>
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
                                    <TableCell>{filial.codigo}</TableCell>
                                    <TableCell>{filial.telefone}</TableCell>
                                    <TableCell>{filial.endereco}</TableCell>
                                    <TableCell>{filial.cidade}</TableCell>
                                    <TableCell>{filial.estado}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEdit(filial)}>Editar</Button>
                                        <Button onClick={() => handleDelete(filial.id)}>Excluir</Button>
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
                                <Input
                                    name="codigo"
                                    placeholder="Código"
                                    value={formData.codigo}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Input
                                    name="telefone"
                                    placeholder="Telefone"
                                    value={formData.telefone}
                                    onChange={handleInputChange}
                                />
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
                                <Input
                                    name="estado"
                                    placeholder="Estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    maxLength={2}
                                />
                            </AddProductForm>
                            <Button type="submit">Salvar</Button>
                            <Button onClick={() => setShowModal(false)}>Cancelar</Button>
                        </form>
                    </ModalContent>
                </ModalContainer>
            )}
        </Container>
    );
};

export default Filiais;
