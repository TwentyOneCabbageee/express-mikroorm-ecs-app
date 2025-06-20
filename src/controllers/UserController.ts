import { GetUserRequestType,CreateUserRequestType, UpdateUserRequestType } from "types/UserTypes";
import { UserService } from "services/UserService";

export class UserController {
    constructor(
        private userService: UserService
    ) {} 

    async getUserById(request:GetUserRequestType, res:any){
        console.log("Fetching user with user Id",request.userId)

        try {
            let users = await this.userService.getUserById(request.userId);
            res.send(users);
        } catch (error:any) {
            console.error("Error fetching user:", error);
            res.status(error.code).send({
                error: error.message,
            });
        }
    }

    async createUser(request:CreateUserRequestType, res:any) {
        console.log("Creating User",request)

        try {
            await this.userService.createUser(request);
            res.status(201).send('User successfully created');
        } catch (error:any) {
            console.error("Error creating user:", error);
            res.status(500).send({
                error: error.message,
            });
        }
    }

    async deleteUser(request:GetUserRequestType, res:any){
        console.log("Deleting user with user Id",request.userId)

        try {
            await this.userService.deleteUser(request.userId);
            res.status(201).send('User successfully deleted');
        } catch (error:any) {
            console.error("Error fetching user:", error);
            res.status(error.code).send({
                error: error.message,
            });
        }
    }

    async updateUser(request:UpdateUserRequestType, res:any) {
        console.log("Updating User",request)

        try {
            await this.userService.updateUser(request);
            res.status(201).send('User successfully updated');
        } catch (error:any) {
            console.error("Error creating user:", error);
            res.status(500).send({
                error: error.message,
            });
        }
    }
}