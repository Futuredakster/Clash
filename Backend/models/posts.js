module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Region: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return Posts;
  };