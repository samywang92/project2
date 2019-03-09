module.exports = function(sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
      actualName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      picture: {
        type: DataTypes.STRING,
        validate: {
          len: [1]
        }
      },
      userID: {
        type: DataTypes.STRING,
        validate: {
          len: [1]
        }
      },
      survey: {
        type: DataTypes.STRING,
        validate: {
          len: [1]
        }
      }
    });
    return Post;
  };
  