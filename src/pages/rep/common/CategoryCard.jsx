import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaArrowRight } from "react-icons/fa";

const CategoryCard = ({ category, onClick }) => {
    return (
        <Card
            onClick={() => onClick(category._id)}
            className="cursor-pointer hover:scale-105 transition-transform duration-300 
                 shadow-lg rounded-xl bg-linear-to-br from-gray-700 to-gray-950 
                 text-white w-50 h-32 flex flex-col justify-between"
        >
            <CardHeader className="text-lg font-bold text-center">
                {category.category ?? "N/A"}
            </CardHeader>

            <CardContent className="flex items-center justify-between px-2">
                <span className="text-sm">{category.categoryCode ?? "N/A"}</span>
                {/* clickable indication icon */}
                <FaArrowRight className="text-gray-700 hover:text-white transition-colors" />
            </CardContent>
        </Card>
    );
};

export default CategoryCard;