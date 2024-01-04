function AccountDescript({info,setInfo}){
    return (
        <div className="other-info-container">
          <input
            type="text"
            placeholder="Account Description"
            value={info. account_description}
            onChange={(e) => {
              setInfo({ ...info, account_description: e.target.value });
            }}
          />
        </div>
      );
}

export default AccountDescript;