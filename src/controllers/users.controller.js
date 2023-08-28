import { userService } from "../services/index.js";

const createUserPremiun = async (req, res) => {
  try {
    //primero me fijo si existe el usuario en la base de datos
    const { uid } = req.params;
    const user = await userService.getUserBy({ _id: uid });
    if (!user) return res.sendNotFound("user not found");

    // una vez que tengo la certeza de que existe, mediante un switch voy
    // escogiendo y asignando las opciones de role
    switch (user.role) {
      case "user":
        await userService.updateUser(uid, { role: "premiun" });
        res.sendSuccess("user successfully upgraded to premium");
        break;

      case "premiun":
        await userService.updateUser(uid, { role: "user" });
        res.sendSuccess("user downgraded successfully");
        break;
    }
  } catch (error) {
    console.log(error);
    res.sendInternalError(error);
  }
};

export default {
  createUserPremiun,
};
