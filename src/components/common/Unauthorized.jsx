import { Link } from "react-router-dom";
import Button from "./Button";

function Unauthorized() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-500">403</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">Unauthorized Access</h2>
                <p className="text-gray-500 mt-2 mb-8">
                    You don't have permission to access this page.
                </p>
                <Link to="/">
                    <Button variant="primary">Go Back</Button>
                </Link>
            </div>
        </div>
    );
}

export default Unauthorized;
