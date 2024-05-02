import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import './chainDropdown.css';  // Import the CSS file

const MyModal = (props: any) => {
    const changeChain =(name: any)=>{
        props.setChain((prev: any)=>{
            let arrToSend = prev.map((item: any)=>{
                if(item.name === name){
                    item.selected = true;
                }else{
                    item.selected = false;
                }
                return item;
            })
            return [...arrToSend];
        })
        props.setShowModal(false);
    }
    return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.content.map((item: any)=>(
            <div className={`d-flex align-items-center unders justify-content-between ${item.selected? 'selected':"nonselected"} mt-1`} style={{ padding:"10px 10px"}} onClick={changeChain.bind(null, item.name)}>
                <div className={`d-flex align-items-center`}>
                    <img src={item.logo} style={{width:"30px", height:'30px',marginRight:"10px"}}></img>
                    <p className='m-0' style={{fontSize:"20px"}}>{item.name}</p>
                </div>
                {
                    item.selected && <img src={item.tick}></img>
                }                
            </div>
        ))}</p>
      </Modal.Body>
    </Modal>
  );
};

export default MyModal;
