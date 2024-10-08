
import { useEffect, useRef, useState} from "react";
import "./chat.css"
import {doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import {db} from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";



const Chat = () => 
{
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
  file: null,
  url   

  });

  const { currentUser } = userUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth"});

  }, []);


  useEffect(()=>{
    const unSub = onSnapshot(
      doc(db,"chats", chatId),
       (res)=>{
        setChat(res.data());
    }
  );

  return () => {
    unSub();
  };
  }, [chatId]);

  const handleImg = (e) => {
    if(e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if(text == "") return;

    let imgUrl = null

    try{

      if(img.file){
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db,"chats", chatId),{
        message:arrayUnion({
          senderId: currentUser.id,
          text,
          createAt: newDate(),
          ...(imgUrl && { img:imgUrl }),
        }),

      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) =>{
      const userChatsRef = doc(db,"userchats", id);
      const userChatsSnapshot = await getDoc(userChatsRef);

      if(userChatsSnapshot.exists()){
        const userChatsData = userChatsSnapshot.data();
        const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
      
        userChatsData.chats[chatIndex].lastmessage = text;
        userChatsData.chats[chatIndex].isSeen =
         id === currentUser.id ? true : false;
        userChatsData[chatIndex].updatedAt = Date.now();

        await updateDoc(userChatsRef,{
          chats:userChatsData.chats,
        });
      }
    });

    }catch(err){
      console.log(err)
    }
    setImg({
      file:null,
      url:"",
    })
    setText("");
  };

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>you are now on chat</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
     
        <div className="center">
          { chat?.messages?.map((message) => (
             <div className="message-wrapper">
            <div className={message.senderId === currentUser?.id ? "message own" : "message" } key={message.createAt}>
            <div className="texts">
              {message.img && <img 
              src={message.img} 
              alt=""
            />}
            
              <p >
                {message.text}
              </p>
             {/* <span>{message}t</span>*/}
            </div>
          </div>
        </div>
        ))}
        {img.url && (
          <div className="message own">
          <div className="texts">
            <img src={img.url} alt="" />
       
        </div>  
      </div>
        )}
      <div ref={endRef}></div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file"> 
          <img src="./img.png" alt="" />
          </label>
          <input type="file"  id = "file" style={{display:"none"}} onChange={handleImg}/>
          <img src="./mic.png" alt="" />
          <img src="./camera.png" alt="" />
        </div>
        <input type="text" placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You can't send a message" : "type a message..."} 
        value = {text}
        onChange={(e) => setText(e.target.value)}
        disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
      </div>
      <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
        send
        </button>
    </div>
    </div>
  );
};

export default Chat;
