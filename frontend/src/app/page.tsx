import { getStrapiData } from "@/data/actions/strapi";
import { ProductosResponse, CategoriasResponse } from "@/lib/interface";
import Image from "next/image";

export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page");
  const dataProductos: ProductosResponse = await getStrapiData(
    "/api/productos?populate=*"
  );
  const dataCategorias: CategoriasResponse = await getStrapiData(
    "/api/categorias?populate=*"
  );

  const { title, description } = strapiData.data;

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="text-xl mt-4">{description}</p>

      <h2 className="text-3xl font-bold mb-6">Categorías</h2>
      <div className="list-disc list-inside">
        {dataCategorias.data.map((categoria) => (
          <div key={categoria.id} className="mb-6">
            <div key={categoria.id}>{categoria.nombre}</div>
            {categoria.imagen && (
              <div key={categoria.slug} className="relative w-3xl h-32 mb-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${categoria.imagen.url}`}
                  alt={categoria.imagen.alternativeText || categoria.nombre}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataProductos.data.map((producto) => (
            <div key={producto.id} className="border rounded-lg p-4 shadow-lg">
              {producto.imagenes && producto.imagenes.length > 0 && (
                <div className="relative w-full h-64 mb-4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${producto.imagenes[0].url}`}
                    alt={
                      producto.imagenes[0].alternativeText || producto.titulo
                    }
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}

              <h3 className="text-xl font-semibold mb-2">{producto.titulo}</h3>
              <p className="text-gray-600 mb-3">{producto.descripcion}</p>

              <div className="flex items-center gap-3 mb-2">
                <p className="text-2xl font-bold text-green-600">
                  ${producto.precio}
                </p>
                {producto.en_oferta && producto.precio_anterior && (
                  <p className="text-lg text-gray-400 line-through">
                    ${producto.precio_anterior}
                  </p>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {producto.destacado && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Destacado
                  </span>
                )}
                {producto.en_oferta && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    En Oferta
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    producto.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Stock: {producto.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
