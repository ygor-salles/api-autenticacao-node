import { getCustomRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/User';
import { UserRespository } from '../repositories/UserRepository';

class UserService {
    private userRepository: Repository<User>;
    constructor() {
        this.userRepository = getCustomRepository(UserRespository);
    }

    
}

export { UserService }