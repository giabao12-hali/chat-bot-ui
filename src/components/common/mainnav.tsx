import { navBarItems } from "@/types/mock/navbar-items";
import { Button } from "../ui/button";


export default function MainNav() {
    return (
        <div className="mr-4 hidden gap-2 md:flex">
            {navBarItems.map((item, index) => (
                <Button key={index} variant="link">
                    {item}
                </Button>
            ))}
        </div>
    );
}