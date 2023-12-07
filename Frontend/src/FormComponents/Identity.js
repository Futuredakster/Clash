

function Identity({info,setInfo}){
    return (
        <div className="other-info-container">
          <input
            type="text"
            placeholder="Username"
            value={info.username}
            onChange={(e) => {
              setInfo({ ...info,username: e.target.value });
            }}
          />
        </div>
      );
}

export default Identity;