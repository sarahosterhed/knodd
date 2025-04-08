import { HelmetProvider } from "react-helmet-async";
import { Link, useParams } from "react-router"
import { useContext } from "react";
import ProductContext from "../contexts/ProductContext";
import { BeatLoader } from "react-spinners";

export const ProductPage = () => {
    const { id } = useParams();
    const { products } = useContext(ProductContext);
    const product = products.find((product) => product.id === Number(id));

    if (products.length == 0) {
        return (
            <section>
                <BeatLoader color="white" />
            </section>
        );
    }

    if (!product) {
        return (
            <section>
                <h2>Product not found</h2>
                <Link to={"/"}><button>Back</button></Link>
            </section>
        )
    }

    return (
        <>
            <HelmetProvider>
                <title>{product.name} | Knodd</title>
                <meta name="description" content={product.description} />
            </HelmetProvider>
            <article>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <img src={product.image} alt={product.name} width="400" />
                <p><b>{product.category}</b></p>
                <p>{product.stock} items left</p>
                <h2>{product.price} kr</h2>
            </article>
            <Link to={"/"}><button>Back</button></Link>
        </>
    )
}
