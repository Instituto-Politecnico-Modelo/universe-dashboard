"use client";
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAllUsersAction, getUserAction, updateUserAction } from '@/actions/userActions';


import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
function cambiarRol(email: string, role: string) {
    
    updateUserAction(email, role);
    console.log("Email: " + email + " Role to: " + role);
}

function Slider(role : string, email : string) {
    let estado = false;
    if(role == "authorized") {
        estado = true;
    }
    const [checked, setChecked] = useState<boolean>(estado);
    
    useEffect(() => {
        cambiarRol(email, checked ? "authorized" : "unauthorized");
    }, [checked]);
    if(email == "admin@gmail.com"){
        return (
            <div className="card flex justify-content-center">
                <InputSwitch disabled checked={checked} onChange={(e: InputSwitchChangeEvent) => setChecked(e.value)} disabled />
            </div>
        );
    }else{ 
        return (
            <div className="card flex justify-content-center">
                <InputSwitch checked={checked} onChange={(e: InputSwitchChangeEvent) => setChecked(e.value)} />
            </div>
        );
    }
}
        
interface User {
    email: string;
    role: string;
}


export default function StripedRowsDemo() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        getAllUsersAction().then((data) => {
            setUsers(data);
        })
    }, []);

    return (
        <div className="card">
            <DataTable value={users} stripedRows tableStyle={{ minWidth: '50rem' }}>
                <Column field="email" header="Email"></Column>
                <Column field="role" header="Autorizado" body={(rowData: any) => Slider(rowData.role, rowData.email)}></Column>
            </DataTable>
        </div>
    );
}

