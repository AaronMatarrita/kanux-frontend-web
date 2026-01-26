import { RegisterBackground } from "@/components/register-background/background";
import { CreateAccountTalent } from "@/components/register-talent/createAccountTalent";

export default function RegisterTalent() {
    return (
        <RegisterBackground step= { 1} >
            <CreateAccountTalent />
        </RegisterBackground>
    );
}