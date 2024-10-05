import "./chat.css"

const Chat = () => {

    return (
        <div className='chat'>
          <div className="top">
            <div className="user">
                <img src="./avatar.png" alt=""/>
                <div className="texts">
                     <span>Kavya</span>
                     <p>you are now on chat</p>
            </div>
        </div>
        <div className="icons">
            <img src="./phone.png" alt=""/>
            <img src="./video.png" alt=""/>
            <img src="./info.png" alt=""/>
        </div>
        </div>
          <div className="center">
            <div className="message">
                <img src="./avatar.png" alt=""/>
                <div className="texts">
                <p >
                    Hello, What' up?? this is my new number, please save it.
                </p>
                <span>1 min ago</span>
                </div>
            </div>
          </div>
          <div className="center">
            <div className="message own">
                <div className="texts">
                <p >
                    Hello, What' up?? this is my new number, please save it.
                </p>
                <span>1 min ago</span>
                </div>
            </div>
          </div>
          <div className="center">
            <div className="message">
            <img src="./avatar.png" alt=""/>
                <div className="texts">
                <p >
                    Hello, What' up?? this is my new number, please save it.
                </p>
                <span>1 min ago</span>
                </div>
            </div>
          </div>
          <div className="center">
            <div className="message own">
                <div className="texts">
                <p >
                    Hello, What' up?? this is my new number, please save it.
                </p>
                <span>1 min ago</span>
                </div>
            </div>
          </div>
          <div className="center">
            <div className="message">
            <img src="./avatar.png" alt=""/>
                <div className="texts">
                <p >
                    Hello, What' up?? this is my new number, please save it.
                </p>
                <span>1 min ago</span>
                </div>
            </div>
          </div>
          <div className="bottom">
            <div className="icons">
                <img src="./mic.png" alt=""/>
                <img src="/img.png" alt=""/>
            </div>
            <input type="text" placeholder="type a message..."/>
            </div>
            <button className="sendButton">send</button>  
          </div>
    )
}

export default Chat
