import "./chatList.css"

const ChatList = () => {
    return (
        <div className='chatList'>ChatList
            <div className="search">
                <div className="searchBar">
                    <img src="/search.png" alt=""/>
                    <input type="text" placeholder="Search"/>
                    
                </div> 
                <img src="./plus.png" alt="" />
            </div>
        </div>
    )
}
export default ChatList