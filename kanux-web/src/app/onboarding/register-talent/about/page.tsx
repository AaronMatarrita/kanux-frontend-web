import { RegisterBackground } from "@/components/register-background/background";
import { CreateAboutTalent } from "@/components/register-talent/aboutAccountTalent";


export default function AboutTalentPage(){
    return(
        <RegisterBackground step={2}>
            <CreateAboutTalent />
        </RegisterBackground>
    );
}