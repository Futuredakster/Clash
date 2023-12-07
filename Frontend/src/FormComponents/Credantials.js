function Credantials({ info, setInfo }) {
    return (
      <div className="other-info-container">
        <input
          type="text"
          placeholder="Email"
          value={info.email}
          onChange={(e) => {
            setInfo({ ...info,email: e.target.value });
          }}
        />
      </div>
    );
  }
  
  export default Credantials;