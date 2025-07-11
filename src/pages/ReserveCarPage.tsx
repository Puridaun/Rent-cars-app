import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import ReserveCarInfo from "../components/ReserveCarInfo";
import React from "react";
import HorizontalNonLinearStepper from "@/components/ui/HorizontalNonLinearStepper";

export interface Benefit {
  name: string;
  description: string;
  price: number;
}

export interface BenefitAndFeaturesPrice {
  clickedBenefit: number | null;
  selectedFeatures: number[];
  clickedBenefitPrice: number;
  selectedFeaturesPrice: number;
}

export const benefits: Benefit[] = [
  {
    name: "Basic protection (CDW)",
    description: `Your liability in case of damage or theft is equal to the value of the deposit.`,
    price: 0,
  },
  {
    name: "Medium protection (SCDW)",
    description: `Your liability in case of damage or theft is equal to the value of the deposit.`,
    price: 50,
  },
  {
    name: "Total protection (SCDW+)",
    description: `
Your liability in case of damage or theft is equal to the value of the deposit.`,
    price: 90,
  },
];

// -------------------Start COMOPONENT --------------------------------------------------------------------------

const ReserveCarPage: React.FC = () => {
  const car = useLocation().state?.car; //Get data from previous page
  const rentInputData = useLocation().state?.rentInputData; //Get data from previous page
  const navigate = useNavigate();
  const toCompleteReservationPage = (): void => {
    navigate(`/complete-reservation`, {
      state: { car, rentInputData, getBenefitAndFeaturesPrice, rentalDays },
    });
  };
  const [getBenefitAndFeaturesPrice, setGetBenefitAndFeaturePrice] =
    useState<BenefitAndFeaturesPrice>({
      clickedBenefit: null,
      selectedFeatures: [],
      clickedBenefitPrice: 0,
      selectedFeaturesPrice: 0,
    });

  const stepPage = 0;

  const getRentalDays = (): number => {
    const start: Date = new Date(rentInputData.rentDate);
    const end: Date = new Date(rentInputData.returnDate);
    const diff: number = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };
  const rentalDays = getRentalDays();

  const handleBenefitSelection = (index: number): void => {
    setGetBenefitAndFeaturePrice((prev) => ({
      ...prev,
      clickedBenefit: index,
      clickedBenefitPrice: benefits[index].price,
    }));
  };

  const handleFeatureSelection = (index: number): void => {
    setGetBenefitAndFeaturePrice((prev) => {
      const currentFeatures = prev.selectedFeatures;
      let features: number[];
      let featurePrice;

      if (currentFeatures.includes(index)) {
        features = currentFeatures.filter((item) => item !== index);
        featurePrice = prev.selectedFeaturesPrice - car.feature_price;
      } else {
        features = [...currentFeatures, index];
        featurePrice = prev.selectedFeaturesPrice + car.feature_price;
      }
      return {
        ...prev,
        selectedFeatures: features,
        selectedFeaturesPrice: featurePrice,
      };
    });
  };

  return (
    <div className="std-section reserved-car-section">
      <HorizontalNonLinearStepper
        currentStep={stepPage} // You're on "Select car" step
        completedSteps={car ? [0] : [-1]} // Mark step 0 as completed if car is selected
      />
      <section className="reserve-car-container">
        <div className="reserve-car-card">
          <ul>
            <li>24/7 roadside assistance</li>
            <li>Free cancellation</li>
            <li>No advance payment</li>
            <li>New models available for car rental</li>
          </ul>
          <div className="reserve-car-image-and-price">
            <img src={car.image} alt="to-reserve-car-image" />
            <div className="reserve-car-price-tag">
              <span className="price-tag">
                {`${car.price * rentalDays} ${car.currency}`}
              </span>
              <span className="nr-days">
                {rentalDays} {rentalDays > 1 ? "DAYS" : "DAY"}
              </span>
            </div>
          </div>
        </div>

        <h3>Protection in case of damage</h3>
        <div key={car.id} className="reserve-car-benefits">
          {benefits.map((benefit: Benefit, index: number) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                handleBenefitSelection(index);
              }}
              className={`car-benefit-card ${
                getBenefitAndFeaturesPrice.clickedBenefit === index
                  ? "selected"
                  : ""
              }`}
            >
              <h3>{benefit.name}</h3>
              <span>{`${benefit.price} ${car.currency}`}</span>
              <p>{benefit.description}</p>
            </button>
          ))}
        </div>

        <h3>Additional equipment</h3>
        <div key={car.id + 1} className="reserve-car-features">
          {car.features.map((feature: string[], index: number) => (
            <div key={index} className="feature-container">
              <button
                key={index}
                type="button"
                onClick={() => {
                  handleFeatureSelection(index);
                }}
                className={`car-feature-card ${
                  getBenefitAndFeaturesPrice.selectedFeatures.includes(index)
                    ? "selected"
                    : ""
                }`}
              >
                <p>{feature}</p>
                <span className="feature-price">{`${car.feature_price} ${car.currency}`}</span>
              </button>
            </div>
          ))}
        </div>
        <ReserveCarInfo
          getBenefitAndFeaturesPrice={getBenefitAndFeaturesPrice}
          rentInputData={rentInputData}
          car={car}
          rentalDays={rentalDays}
          text="Next Step"
          action={() => {
            toCompleteReservationPage();
          }}
        />
      </section>
    </div>
  );
};

export default ReserveCarPage;
