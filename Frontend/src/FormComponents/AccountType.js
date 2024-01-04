function AccountType({info,setInfo}){
    return (
        <div className="other-info-container">
          <input
            type="text"
            placeholder="Account Type"
            value={info.account_type}
            onChange={(e) => {
              setInfo({ ...info,account_type: e.target.value });
            }}
          />
        </div>
      );
}

export default AccountType;