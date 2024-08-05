'use client';
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Api, HttpResponse } from "@/services/api";
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber,InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { constants } from "@/utils/constants";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';


interface Camera {
    id: string ;
    name: string;
    location: string;
    url: string;
    threshold: number;
}
export default function CamerasDemo(){
    let emptyCamera: Camera = {
        id: '',
        name: '',
        location: '',
        url: '',
        threshold: 0,
    };



    const [cameras, setCameras] = useState<Camera[]>([]);
    const [cameraDialog, setCameraDialog] = useState<boolean>(false);
    const [deleteCameraDialog, setDeleteCameraDialog] = useState<boolean>(false);
    const [deleteCamerasDialog, setDeleteCamerasDialog] = useState<boolean>(false);
    const [camera, setCamera] = useState<Camera>(emptyCamera);
    const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Camera[]>>(null);
    const api = new Api({ baseUrl: constants.API_URL });

    useEffect(() => {
        api.camaras.camarasList().then((response: HttpResponse<Camera[], any>) => {
          setCameras(response.data);    
        });
      }, []);


    const openNew = () => {
        setCamera(emptyCamera);
        setSubmitted(false);
        setCameraDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCameraDialog(false);
    };

    const hideDeleteCameraDialog = () => {
        setDeleteCameraDialog(false);
    };

    const hidedeleteCamerasDialog = () => {
        setDeleteCamerasDialog(false);
    };

    const saveCamera = () => {
        setSubmitted(true);

        if (camera.name.trim()) {
            let _cameras = [...cameras];
            let _camera = { ...camera };

          
            const index = findIndexById(camera.id);

            _cameras[index] = _camera;
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Camera Updated', life: 3000 });
    

            setCameras(_cameras);
            setCameraDialog(false);
            setCamera(emptyCamera);
            api.camara.camaraCreate({
                name: camera.name,
                location: camera.location,
                url: camera.url,
                threshold: camera.threshold,
                id: ""
            });
        }
    };

    const editCamera = (camera: Camera) => {
        setCamera({ ...camera });
        setCameraDialog(true);
    };

    const confirmDeleteCamera = (camera: Camera) => {
        setCamera(camera);
        setDeleteCameraDialog(true);
    };

    const deleteCamera = () => {
        let _cameras = cameras.filter((val) => val.id !== camera.id);

        setCameras(_cameras);
        setDeleteCameraDialog(false);
        setCamera(emptyCamera);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Camera Deleted', life: 3000 });
    };

    const findIndexById = (id: string) => {
        let index = -1;

        for (let i = 0; i < cameras.length; i++) {
            if (cameras[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };



    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteCamerasDialog(true);
    };

    const deleteSelectedCameras = () => {
        let _cameras = cameras.filter((val) => !selectedCameras.includes(val));

        setCameras(_cameras);
        setDeleteCamerasDialog(false);
        setSelectedCameras([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Cameras Deleted', life: 3000 });
    };



    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _camera = { ...camera };

        // @ts-ignore
        _camera[name] = val;

        setCamera(_camera);
    };


    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value ?? 0;
        let _camera = { ...camera };

        // @ts-ignore
        _camera[name] = val;

        setCamera(_camera);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCameras || !selectedCameras.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

 
    const actionBodyTemplate = (rowData: Camera) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCamera(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCamera(rowData)} />
            </React.Fragment>
        );
    };

    

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Cameras</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                 <InputText type="search" placeholder="Search..." onInput={(e) => {const target = e.target as HTMLInputElement; setGlobalFilter(target.value);}}  />
            </IconField>
        </div>
    );
    const cameraDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveCamera} />
        </React.Fragment>
    );
    const deleteCameraDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCameraDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteCamera} />
        </React.Fragment>
    );
    const deleteCamerasDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hidedeleteCamerasDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedCameras} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={cameras} selection={selectedCameras} 
                        onSelectionChange={(e) => {
                            if (Array.isArray(e.value)) {
                                setSelectedCameras(e.value);
                            }
                        }}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} cameras" globalFilter={globalFilter} header={header}
                        selectionMode="multiple"
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="id" header="Id" sortable style={{ minWidth: '12%' }}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '12%' }}></Column>
                    <Column field="url" header="Url" sortable style={{ minWidth: '12%' }}></Column>
                    <Column field="location" header="Location" sortable style={{ minWidth: '12%' }}></Column>
                    <Column field="threshold" header="Threshold" sortable style={{ minWidth: '12%' }}></Column>

                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12%' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={cameraDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Camera Details" modal className="p-fluid" footer={cameraDialogFooter} onHide={hideDialog}>
               <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={camera.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !camera.name })} />
                    {submitted && !camera.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="url" className="font-bold">
                        Url
                    </label>
                    <InputText id="url" value={camera.url} onChange={(e) => onInputChange(e, 'url')} required autoFocus className={classNames({ 'p-invalid': submitted && !camera.url })} />
                    {submitted && !camera.url && <small className="p-error">Url is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="location" className="font-bold">
                        Location
                    </label>
                    <InputText id="location" value={camera.location} onChange={(e) => onInputChange(e, 'location')} required autoFocus className={classNames({ 'p-invalid': submitted && !camera.location })} />
                    {submitted && !camera.location && <small className="p-error">Location is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="threshold" className="font-bold">
                        Threshold
                    </label>
                    <InputText id="name" value={String(camera.threshold)} onChange={(e) => onInputChange(e, 'threshold')} required autoFocus className={classNames({ 'p-invalid': submitted && !camera.threshold })} />
                                        
                    {submitted && !camera.threshold && <small className="p-error">Threshold is required.</small>}
                </div>
    
            </Dialog>

            <Dialog visible={deleteCameraDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteCameraDialogFooter} onHide={hideDeleteCameraDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {camera && (
                        <span>
                            Are you sure you want to delete <b>{camera.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteCamerasDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteCamerasDialogFooter} onHide={hidedeleteCamerasDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {camera && <span>Are you sure you want to delete the selected cameras?</span>}
                </div>
            </Dialog>
        </div>
    );
}

        