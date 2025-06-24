
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Trip {
  id: string;
  mode: string;
  amount: number;
  tip: number;
  paymentMode: string;
  partPayment?: {
    enabled: boolean;
    amount1: number;
    amount1Mode: string;
    amount2: number;
    amount2Mode: string;
  };
}

interface ShiftData {
  vehicleNumber: string;
  shiftType: string;
  vehicleCategory: string;
  startTime: Date | null;
  totalTripsPlanned: number;
  endShiftData?: {
    totalCash: number;
    totalQR: number;
    totalUberRapido: number;
    totalWallet: number;
    totalCard: number;
  };
}

interface TripDetailsState {
  employeeId: string;
  currentStep: 'employee-id' | 'start-shift' | 'active-shift' | 'end-shift';
  shiftData: ShiftData;
  trips: Trip[];
  isShiftStarted: boolean;
  isShiftEnded: boolean;
}

type TripDetailsAction = 
  | { type: 'SET_EMPLOYEE_ID'; payload: string }
  | { type: 'START_SHIFT'; payload: ShiftData }
  | { type: 'ADD_TRIP'; payload: Trip }
  | { type: 'UPDATE_TRIP'; payload: { id: string; trip: Partial<Trip> } }
  | { type: 'DELETE_TRIP'; payload: string }
  | { type: 'END_SHIFT'; payload: ShiftData['endShiftData'] }
  | { type: 'NEXT_STEP' }
  | { type: 'RESET' };

const initialState: TripDetailsState = {
  employeeId: '',
  currentStep: 'employee-id',
  shiftData: {
    vehicleNumber: '',
    shiftType: '',
    vehicleCategory: '',
    startTime: null,
    totalTripsPlanned: 0,
  },
  trips: [],
  isShiftStarted: false,
  isShiftEnded: false,
};

function tripDetailsReducer(state: TripDetailsState, action: TripDetailsAction): TripDetailsState {
  switch (action.type) {
    case 'SET_EMPLOYEE_ID':
      return {
        ...state,
        employeeId: action.payload,
        currentStep: 'start-shift',
      };
    case 'START_SHIFT':
      return {
        ...state,
        shiftData: action.payload,
        currentStep: 'active-shift',
        isShiftStarted: true,
      };
    case 'ADD_TRIP':
      return {
        ...state,
        trips: [...state.trips, action.payload],
      };
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map(trip => 
          trip.id === action.payload.id 
            ? { ...trip, ...action.payload.trip }
            : trip
        ),
      };
    case 'DELETE_TRIP':
      return {
        ...state,
        trips: state.trips.filter(trip => trip.id !== action.payload),
      };
    case 'END_SHIFT':
      return {
        ...state,
        shiftData: {
          ...state.shiftData,
          endShiftData: action.payload,
        },
        currentStep: 'end-shift',
        isShiftEnded: true,
      };
    case 'NEXT_STEP':
      const steps: TripDetailsState['currentStep'][] = ['employee-id', 'start-shift', 'active-shift', 'end-shift'];
      const currentIndex = steps.indexOf(state.currentStep);
      const nextStep = steps[currentIndex + 1] || state.currentStep;
      return {
        ...state,
        currentStep: nextStep,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface TripDetailsContextType {
  state: TripDetailsState;
  dispatch: React.Dispatch<TripDetailsAction>;
  setEmployeeId: (id: string) => void;
  startShift: (shiftData: ShiftData) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  endShift: (endData: ShiftData['endShiftData']) => void;
  resetState: () => void;
}

const TripDetailsContext = createContext<TripDetailsContextType | undefined>(undefined);

export const TripDetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tripDetailsReducer, initialState);

  const setEmployeeId = (id: string) => {
    dispatch({ type: 'SET_EMPLOYEE_ID', payload: id });
  };

  const startShift = (shiftData: ShiftData) => {
    dispatch({ type: 'START_SHIFT', payload: shiftData });
  };

  const addTrip = (trip: Trip) => {
    dispatch({ type: 'ADD_TRIP', payload: trip });
  };

  const updateTrip = (id: string, trip: Partial<Trip>) => {
    dispatch({ type: 'UPDATE_TRIP', payload: { id, trip } });
  };

  const deleteTrip = (id: string) => {
    dispatch({ type: 'DELETE_TRIP', payload: id });
  };

  const endShift = (endData: ShiftData['endShiftData']) => {
    dispatch({ type: 'END_SHIFT', payload: endData });
  };

  const resetState = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <TripDetailsContext.Provider value={{
      state,
      dispatch,
      setEmployeeId,
      startShift,
      addTrip,
      updateTrip,
      deleteTrip,
      endShift,
      resetState,
    }}>
      {children}
    </TripDetailsContext.Provider>
  );
};

export const useTripDetails = () => {
  const context = useContext(TripDetailsContext);
  if (context === undefined) {
    throw new Error('useTripDetails must be used within a TripDetailsProvider');
  }
  return context;
};
