function AccountName({info,setInfo}){
    return (
        <div className="other-info-container">
          <input
            type="text"
            placeholder="Account Name"
            value={info. account_name}
            onChange={(e) => {
              setInfo({ ...info, account_name: e.target.value });
            }}
          />
        </div>
      );
}

export default AccountName;