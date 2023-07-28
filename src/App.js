import { useRef, useState, useEffect } from 'react';
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
    { text: "Example 6", completed: false }
  ]);

  const [archiveArray, setArchiveArray] = useState([]);
 
  const [selectedTab, setSelectedTab] = useState("main");

 // Runs once to load up the saved version of the toDoArray
  useEffect(() => {
    const array = JSON.parse(localStorage.getItem('toDoArray'));
    setToDoArray(array);
    const archiveArray = JSON.parse(localStorage.getItem('archiveArray'));
    setArchiveArray(archiveArray);
  }, []);

 // Runs everytime toDoArray is changed to update the local storage
  useEffect(() => {
    localStorage.setItem('toDoArray', JSON.stringify(toDoArray))
    localStorage.setItem('archiveArray', JSON.stringify(archiveArray))
  }, [toDoArray, archiveArray])

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

  const archiveItem = (index) => {
    let array = [...toDoArray];
    let arcArray = [...archiveArray];
    arcArray.push(array[index]);
    array.splice(index, 1);
    console.log(arcArray);
    setToDoArray(array);
    setArchiveArray(arcArray);
  }
  const unArchiveItem = (index) => {
    let array = [...toDoArray];
    let arcArray = [...archiveArray];
    array.push(arcArray[index]);
    arcArray.splice(index, 1);
    setToDoArray(array);
    setArchiveArray(arcArray);
  }


  return (
    <div className='allWrap'>
      <h1>TO DO LIST</h1>
      <div className='addItemsWrap'>
        <input ref={inputBox}></input>
        <button onClick={addItem}>add</button>
      </div>
      <div>
        <button onClick={() => setSelectedTab("main")} className={selectedTab === "archive" ? "tabs":'tabs selectedTab'}>Main</button>
        <button onClick={() => setSelectedTab("archive")} className={selectedTab === "main" ? "tabs":'tabs selectedTab'}>Archive</button>
      </div>
      <div className="allItemsWrap">
        {toDoArray.map((item, index) => {
          return (
            <div className={selectedTab === "archive" ? "hidden":""}>
              <ListItems key={index} item={item.text} isItCompleted={item.completed} delete={() => {deleteItem(index)}} completed={() => {completedItem(index)}} archive={() => {archiveItem(index)}} onContentChange={(evt) => onContentChange(evt, index)}/>  
            </div> 
          )
        })}
        {archiveArray.map((arcItem, index) => {
          return (
            <div className={selectedTab === "main" ? "hidden":""}>
              <ArchiveItems key={index} arcItem={arcItem.text} unArchive={() => {unArchiveItem(index)}} isItCompleted={arcItem.completed}/>
            </div>
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
        <button className='archiveButton' onClick={props.archive}>archive</button>
      </div>
    </div>
  )
}

const ArchiveItems = (props) => {
    return (
      <div className='itemsWrap'>
        <p className={props.isItCompleted? "items completed":"items"}>{props.arcItem}</p>
        <button className='archiveButton' onClick={props.unArchive}>unarchive</button>
      </div>
    )
}

export default App;
