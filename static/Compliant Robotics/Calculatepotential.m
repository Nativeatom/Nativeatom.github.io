%define environment, goal and obstacle placement
%change the file name to CalculatePotential.m after completion
%Pobs(:,i) store i-th obstacle position in x,y
%Pgoal: position of target in x,y
%x: positon of a point on the manipulator

function [Unet, Fnet, Frep, Fatt] = Calculatepotential(xm, Pobst, Pgoal, Krep, Katt, rhoBase)

%input the position vector of a single point x
%returns the potential and force acting on that point.

N = size(Pobst,2); %number of obstacles
%basic terms & constants
rhoGoal = norm(Pgoal - xm); %scalar distance to goal from point


%initialise variables
rhoObs = zeros(1,N)';
deltaObs = zeros(size(Pobst,1),N);

Urep = 0;
Frep = [0,0]';
   
for ii = 1:N %for each obstacle
    %calculate distance vector and magnitude for current obstacle
    deltaObs(:,ii) =  xm'-Pobst(:,ii);
    rhoObs(ii) = norm(deltaObs(:,ii));

    %calculate repulseive potential
    if rhoObs(ii) <= rhoBase(ii)
        Urep = Urep + 0.5*Krep*(1/rhoObs(ii)-1/rhoBase(ii))^2;
    end

    %calcualte repulsive force for current obstacle
    if rhoObs(ii) <= rhoBase(ii)
        Frep = Frep + Krep*(1/rhoObs(ii)-1/rhoBase(ii))*(xm'-Pobst(:,ii))/rhoObs(ii)^3;
    end

end

%caluclate the attractive potential
deltaGoal = Pgoal - xm; %行向量
Uatt = 0.5*Katt*rhoGoal^2;

%calculate attractive force Fatt
Fatt = Katt*deltaGoal;

%find net force Fnet
Fnet = Fatt+Frep';

%find net potential
Unet = Uatt+Urep;

end