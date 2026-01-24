import { RegisterBackground } from "@/components/register-background/background";
import { CreateAboutCompany } from "@/components/register-company/createAboutCompany";

export default function AboutCompanyPage(){
    return(
        <RegisterBackground step={2}>
            <CreateAboutCompany />
        </RegisterBackground>
    );
}