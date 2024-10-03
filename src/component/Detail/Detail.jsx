import "./detail.css"

const Detail = () => {
    return (
        <div className='detail'>
            <div className="user">
                <img src="./avatar.png" alt=""/>
                <h2>Kavya</h2>
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
               <button>Block User</button>
        </div>
    );
};

export default Detail