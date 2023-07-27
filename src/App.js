import { useRef, useState, useCallback } from 'react';
import './App.css';
import ContentEditable from 'react-contenteditable'
import sanitizeHtml from "sanitize-html"

function App() {
  const [toDoArray, setToDoArray] = useState([
    { text: "Example 1", completed: false },
    { text: "Example 2", completed: false },
    { text: "Example 3 extended so that it takes up more than one line", completed: false },
    { text: "Example 4", completed: false },
    { text: "Example 5", completed: false },
    { text: "Example 6", completed: false },
    { text: "Example 7", completed: false }
  ]);
  
  const inputBox = useRef()

  const onContentChange = (evt, index) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p"],
      allowedAttributes: { a: ["href"] }
    };
    let array = [...toDoArray];
    array[index].text = sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf) ;
    setToDoArray(array)
  } 

  const addItem = () => {
    if(inputBox.current.value !== ""){
      let array = [...toDoArray];
      array.push({ text: inputBox.current.value, completed: false });
      inputBox.current.value = ""
      setToDoArray(array);
    }
  }

  const deleteItem = (index) => {
    let array = [...toDoArray];
      array.splice(index, 1);
      setToDoArray(array);
  }

  const completedItem = (index) => {
    let array = [...toDoArray];
    if (array[index].completed === false){
      array[index].completed = true;
      setToDoArray(array);
    } else {
      array[index].completed = false;
      setToDoArray(array);
    }
  }


  return (
    <div className='allWrap'>
      <h1>TO DO LIST</h1>
      <input ref={inputBox}></input>
      <button onClick={addItem}>add</button>
      <div className="allItemsWrap">
        {toDoArray.map((item, index) => {
          return (
            <ListItems key={index} item={item.text} isItCompleted={item.completed} delete={() => {deleteItem(index)}} completed={() => {completedItem(index)}} onContentChange={(evt) => onContentChange(evt, index)}/>   
          )
        })}
      </div>
    </div>
  );
}

const ListItems = (props) => {
  return (
    <div className='itemsWrap'>
		<ContentEditable
			onChange={props.onContentChange}
			html={props.item}
      contentEditable={true}
      className={props.isItCompleted? "items completed":"items"}
    />
      <div className='buttonsWrap'>
        <button className='doneButton' onClick={props.completed}>
          {props.isItCompleted ? "undo" : "done"}
        </button>
        <button className='deleteButton' onClick={props.delete}>delete</button>
      </div>
    </div>
  )
}

export default App;
