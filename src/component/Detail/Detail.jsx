import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth } from "../../lib/firebase";
import "./detail.css"

const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
        useChatStore();
    const { currentUser } = useUserStore();

    const handleBlock = async () => {
        if(!user) return;

        const userDocRef = doc(db,"users",currentUser.id )
        
        try {
            await updateDoc(userDocRef,{
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });
            changeBlock()
            
        } catch (err) {
            console.log(err)
            
        }

    };
    return (
        <div className='detail'>
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt=""/>
                <h2>{user?.username} </h2>
                <p>this is my  status</p>
            </div>
            <div className="info">
               <div className="option">
                <div className="title">
                    <span> Chat Setting</span>
                    <img src="./arrowDown.png" alt=""/>     
                </div>
                </div> 
                <div className="option">
                <div className="title">
                    <span>Privacy & Help</span>
                    <img src="./arrowUp.png" alt=""/>     
                </div>
                </div> 
                <div className="option">
                <div className="title">
                    <span> Shared photos</span>
                    <img src="./arrowDown.png" alt=""/>     
                </div>
            
                    <div className="photos">
                        <div className="photoItems">
                      <img src="" alt=""/>
                      <span>2024.png</span>
                    </div>
                </div>
                </div> 
                <div className="option">
                <div className="title">
                    <span>Shares Files</span>
                    <img src="./arrowUp.png" alt=""/>
                    <span> Chat Setting</span>
                    <img src="./arrow.png" alt=""/>     
                </div>
             </div> 
               
            </div>
            <button onClick={handleBlock}>{
            
isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User blocked" : "Block User"         
}
            </button>
            <button className="logout" onClick={()=>auth.signOut()}>Logout</button>
        </div>
    );
};

export default Detail