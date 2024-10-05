import Chat from "./component/Chat/chat";
import List from "./component/List/list";
import Detail from "./component/Detail/Detail";
const App = () => {
  return (
    <div className='container'>
      <List/>
      {chatId && <Chat/>}
      {chatId && <Detail/>}
    </div>
  );
}

export default App;