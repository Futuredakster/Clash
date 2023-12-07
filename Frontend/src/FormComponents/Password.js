

function Password({info,setInfo}){
    return (
        <div className="other-info-container">
          <input
            type="text"
            placeholder="Password"
            value={info.password_hash}
            onChange={(e) => {
              setInfo({ ...info,password_hash: e.target.value });
            }}
          />
        </div>
      );
}

export default Password;