import React, {useState} from "react";
import Header from "../components/board/header";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import Item from "../components/board/item";
import DropWrapper from "../components/board/dropWrapper";
import Column from "../components/board/column";
import {data, statuses as stats} from "../data/index";
import "../assets/styles/board.css";
import { App } from "../app/App";
import { Navbar } from "../components/navbar";



var columnNameWindows = [stats.length];
var columnIndexWindows = [stats.length];
    for(var i=0; i<stats.length;i++){
        columnNameWindows[i] = "hidden";
        columnIndexWindows[i] = "hidden";
    }

const BoardPage = () => {

    const [items, setItems] = useState(data);
    const [statuses, setStatuses] = useState(stats);
    const [showColumnNameWindow, setColumnNameWindowVisibility] = useState(columnNameWindows);
    const [showColumnIndexWindow, setColumnIndexWindowVisibility] = useState(columnIndexWindows);


    const onDrop = (item, monitor, status)=>{
        const mapping = statuses.find(si=>si.status===status);
 
        
        setItems(prevState=>{
            const newItems = prevState
            .filter(i=>i.id !== item.id)
            .concat({...item, status, icon: mapping.icon});
            return [...newItems];
        });
    };

    const moveItem = (dragIndex, hoverIndex)=>{
        const item = items[dragIndex];
        setItems(prevState=>{
            const newItems = prevState.filter((i,indx)=>indx!==dragIndex);
            newItems.splice(hoverIndex, 0, item);
            return [...newItems];
        });
    };

    function editColumnIcon(s,e){

        const editedColumnId = statuses.findIndex(si=>si.status===s.status);
        
            e.preventDefault();
            console.log("Funkcja wywolana");
            var iconsCollection = ["🔴","🟠","🟡","🟢","🔵","🟣","⚫️","⚪️","🟤"];
            var colorsCollection = ["red","orange","yellow","green","blue","purple","black","white","brown"];

            var index = iconsCollection.findIndex(si=>si===s.icon)
        
            if(index<iconsCollection.length-1){
                index++;
            }
            else{
                index=0;
            }
            s.icon = iconsCollection[index];
            s.color = colorsCollection[index];
            statuses[editedColumnId].color = s.color;
            statuses[editedColumnId].icon = s.icon;

            
            setStatuses(prevState=>{
                const newStatuses = statuses;
                return[...newStatuses];
            });

    };


    function setColumnNameWindowVisible(s,e){
        e.preventDefault();
        const editedColumnId = statuses.findIndex(si=>si.status===s.status);
        var tmp = showColumnNameWindow;
        tmp[editedColumnId] = "visible";
        setColumnNameWindowVisibility(()=>{
            return [...tmp];
        })
    }
    function setColumnNameWindowHidden(s,e){
        e.preventDefault();
        const editedColumnId = statuses.findIndex(si=>si.status===s.status);
        var tmp = showColumnNameWindow;
        tmp[editedColumnId] = "hidden";
        setColumnNameWindowVisibility(()=>{
            return [...tmp];
        })
    }

    function editColumnTitle(s,e){
        
        e.preventDefault();

        const editedColumnId = statuses.findIndex(si=>si===s);
        var newName = document.getElementsByClassName("new-column-name")[editedColumnId].value;
        var prevStatus = s.status;
        s.status = newName;
        statuses[editedColumnId].status = s.status;
        
        setStatuses(()=>{
            const newStatuses = statuses;
            return [...newStatuses];
        })

        setItems(()=>{
            for(var i=0;i<items.length;i++){
                if(items[i].status === prevStatus){
                    items[i].status = newName;
                }
            }
            return [...items]
        })
    }

    function setColumnIndexWindowVisible(s,e){
        e.preventDefault();
        const editedColumnId = statuses.findIndex(si=>si.status===s.status);
        var tmp = showColumnIndexWindow;
        tmp[editedColumnId] = "visible";
        setColumnIndexWindowVisibility(()=>{
            return [...tmp];
        })
    }

    function setColumnIndexWindowHidden(s,e){
        e.preventDefault();
        const editedColumnId = statuses.findIndex(si=>si.status===s.status);
        var tmp = showColumnNameWindow;
        tmp[editedColumnId] = "hidden";
        setColumnIndexWindowVisibility(()=>{
            return [...tmp];
        })
    }

    function changeColumnPosition(s,e){
        e.preventDefault();   

        const editedColumnIndex = statuses.indexOf(s); 
        const indexValue = document.getElementsByClassName("new-column-index")[editedColumnIndex].value;
        const selectedIndex = indexValue;

        const howManyTimes = selectedIndex - editedColumnIndex;
        console.log(Math.abs(howManyTimes))
        
        if(howManyTimes<0){
            for(let i=0; i<Math.abs(howManyTimes); i++){
                columnSwap(s,"left");
            }
        }
        else if(howManyTimes>0){
            for(let i=0; i<howManyTimes; i++){
                columnSwap(s,"right");
            }
        }
    }

    function columnSwap(s, direction){
       
        if(direction==="right"){
           var tmp = statuses[statuses.indexOf(s)+1];
           statuses[statuses.indexOf(s)+1] = s;
           statuses[statuses.indexOf(s)] = tmp;
        }
        else{
            var tmp = statuses[statuses.indexOf(s)-1];
           statuses[statuses.indexOf(s)-1] = s;
           statuses[statuses.indexOf(s)] = tmp;
        }
        setStatuses(()=>{
            const newStatuses = statuses;
            return [...newStatuses]; 
        });
    }

    function updateIndexInput(s,e){
        e.preventDefault();
        var indexValue = document.getElementsByClassName("new-column-index")[statuses.indexOf(s)].value;
        document.getElementsByClassName("index-label")[statuses.indexOf(s)].textContent = indexValue;
    }

    function addItem(s,e){
        e.preventDefault();

        setItems(prevState=>{
            items.push({
                id: prevState.length,
                icon: s.icon,
                status: s.status,
                title: "New task",
                content: "Add description"
            });
            return [...items];
        });
        console.log(items.length);
    }

    function deleteItem(itemId,e){
        e.preventDefault();
        setItems(()=>{
            items.splice(itemId,1);
            return [...items];
        });
    }

    return(
        <div>
            <DndProvider backend={HTML5Backend}>
            <Header/> 
            <div className={"row"}>

            {statuses.map(s=>{
                return (                  
                    <div key={s.status} className={"col-wrapper"}>
                        <div className="edit-col-name-window" style={{visibility: `${showColumnNameWindow[statuses.indexOf(s)]}` }}>
                                <button style={{position: "absolute", marginLeft: "230px"}} onClick={(e)=>setColumnNameWindowHidden(s,e)}>X</button>
                                <h3>Enter new column name:</h3>
                                <input type="text" className="new-name" class="new-column-name" name="text"/>
                                <input type="submit" name="submit" onClick={(e)=>editColumnTitle(s,e)} value="Confirm"/>
                        </div>
                        <div className="edit-col-name-window" style={{visibility: `${showColumnIndexWindow[statuses.indexOf(s)]}` }}>
                                <button style={{position: "absolute", marginLeft: "230px"}} onClick={(e)=>setColumnIndexWindowHidden(s,e)}>X</button>
                                <h3>Enter new column index:</h3>
                                <input type="range" className="new-column-index" id="index" min="0" max={statuses.length-1} name="index" onChange={(e)=>updateIndexInput(s,e)}/>
                                <label className="index-label" for="index" value="0"></label>
                                <input type="submit" name="submit" onClick={(e)=>changeColumnPosition(s,e)} value="Confirm"/>
                        </div>
                        <div className="col-header-div">
                        <button className="col-icon-button" onClick={(e)=>editColumnIcon(s,e)}>{s.icon}</button>
                            <div className={"col-header"} onBlur={(e)=>editColumnTitle(s,e)} >{s.status.toUpperCase()}</div>
                            <button className="edit-col-button">...
                            <div class="dropdown-edit-column">
                                <a onClick={(e)=>setColumnNameWindowVisible(s,e)}>Edit column name</a>
                                <a onClick={(e)=>setColumnIndexWindowVisible(s,e)}>Change position</a>
                                <a href="#" style={{color: "darkred"}}>Delete column</a>
                            </div>
                        </button>
                        </div>                       
                        <DropWrapper onDrop={onDrop} status={s.status}>                         
                            <Column status={s}>                           
                                {items
                                    .filter(i => i.status === s.status)
                                    .map((i, indx) => <Item key={i.id} item={i} index={indx} moveItem={moveItem} deleteItem={(e)=>deleteItem(i.id,e)} status={s} />)
                                }      
                                <button id="add-item-btn" onClick={(e)=>addItem(s,e)}>ADD TASK</button>                       
                            </Column>
                        </DropWrapper>
                    </div>
                );
            })}
            </div>
            </DndProvider>           
        </div>
    );
};

export default BoardPage;

