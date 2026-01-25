
import { RegisterBackground } from "@/components/register-background/background";
import { CreateAccountCompany } from "@/components/register-company/createAccountCompany";

export default function RegisterCompany(){
    return(
        <RegisterBackground step={1}>
            <CreateAccountCompany />
        </RegisterBackground>
    );
}