import React from 'react';
import { ShoppingCart, ExternalLink, TrendingDown, Award } from 'lucide-react';

const PriceComparison = ({ deals }) => {
    if (!deals || deals.length === 0) return null;

    const bestDeal = deals[0]; // Assumes sorted by price

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                <div>
                    <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                        <span>Price Comparison</span>
                    </h3>
                    <p className="text-sm text-slate-500">Found {deals.length} other offers for this product</p>
                </div>
                {bestDeal.savings && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        Save up to {bestDeal.savings}
                    </div>
                )}
            </div>

            <div className="divide-y divide-slate-100">
                {deals.map((deal, index) => (
                    <div key={index} className={`p-4 flex justify-between items-center hover:bg-slate-50 transition-colors ${index === 0 ? 'bg-green-50/30' : ''}`}>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm shadow-sm">
                                {deal.platform[0]}
                            </div>
                            <div>
                                <div className="font-semibold text-slate-800 flex items-center">
                                    {deal.platform}
                                    {index === 0 && <Award className="w-4 h-4 text-amber-500 ml-2" />}
                                </div>
                                <div className="text-xs text-slate-500">In Stock</div>
                            </div>
                        </div>

                        <div className="text-right">
                            {deal.price === "View Price" ? (
                                <span className="text-sm font-semibold text-slate-500">Check Availability</span>
                            ) : (
                                <div className="font-bold text-slate-900 text-lg">{deal.price}</div>
                            )}

                            <a
                                href={deal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center mt-2 px-3 py-1.5 rounded text-xs font-bold transition-colors ${deal.price === "View Price"
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "text-blue-600 hover:text-blue-800"
                                    }`}
                            >
                                {deal.price === "View Price" ? `View on ${deal.platform}` : "Buy Now"}
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PriceComparison;
