<?php

$refno = $_GET['refno'];

// Fetch firm details from the API
$url1 = "https://aquaxa.tensoftware.in/api/Customer?stype=AGENTBOOKINGFORPRINT&dbase=aquaxa2425&refno=$refno";
$response1 = file_get_contents($url1);
if ($response1 === false) {
    die('Error fetching data from the API for URL 1');
}
$data1 = json_decode($response1, true);
if ($data1 === null) {
    die('Error decoding JSON response for URL 1');
}

$phoneno = $data1[0]['phoneno'];
$customer_name = $data1[0]['customer_name'];
$item_name = $data1[0]['item_name'];
$issue_date = $data1[0]['issue_date'];
$coupon_no = $data1[0]['coupon_no'];
$payment_mode = $data1[0]['payment_mode'];
$qty = $data1[0]['qty'];
$no_of_person = $data1[0]['no_of_person'];
$rate = $data1[0]['rate'];
$amount = $data1[0]['amount'];
$gst = $data1[0]['gst'];
$taxable = $data1[0]['taxable'];
$cgst = $data1[0]['cgst'];
$sgst = $data1[0]['sgst'];
$final_amount = $data1[0]['final_amount'];
$validity = $data1[0]['validity'];

//convert_number_to_words
function convert_number_to_words($number)
{
    $hyphen      = '-';
    $conjunction = ' and ';
    $separator   = ', ';
    $negative    = 'negative ';
    $decimal     = ' point ';
    $dictionary  = array(
        0                   => 'Zero',
        1                   => 'One',
        2                   => 'Two',
        3                   => 'Three',
        4                   => 'Four',
        5                   => 'Five',
        6                   => 'Six',
        7                   => 'Seven',
        8                   => 'Eight',
        9                   => 'Nine',
        10                  => 'Ten',
        11                  => 'Eleven',
        12                  => 'Twelve',
        13                  => 'Thirteen',
        14                  => 'Fourteen',
        15                  => 'Fifteen',
        16                  => 'Sixteen',
        17                  => 'Seventeen',
        18                  => 'Eighteen',
        19                  => 'Nineteen',
        20                  => 'Twenty',
        30                  => 'Thirty',
        40                  => 'Forty', // Corrected spelling from Fourty to Forty
        50                  => 'Fifty',
        60                  => 'Sixty',
        70                  => 'Seventy',
        80                  => 'Eighty',
        90                  => 'Ninety',
        100                 => 'Hundred',
        1000                => 'Thousand',
        1000000             => 'Million',
        1000000000          => 'Billion',
        1000000000000       => 'Trillion',
        1000000000000000    => 'Quadrillion',
        1000000000000000000 => 'Quintillion'
    );

    if (!is_numeric($number)) {
        return false;
    }

    if (($number >= 0 && (int) $number < 0) || (int) $number < 0 - PHP_INT_MAX) {
        // overflow
        trigger_error(
            'convert_number_to_words only accepts numbers between -' . PHP_INT_MAX . ' and ' . PHP_INT_MAX,
            E_USER_WARNING
        );
        return false;
    }

    if ($number < 0) {
        return $negative . convert_number_to_words(abs($number));
    }

    $string = $fraction = null;

    if (strpos($number, '.') !== false) {
        list($number, $fraction) = explode('.', $number);
    }

    switch (true) {
        case $number < 21:
            $string = $dictionary[$number];
            break;
        case $number < 100:
            $tens   = ((int) ($number / 10)) * 10;
            $units  = $number % 10;
            $string = $dictionary[$tens];
            if ($units) {
                $string .= $hyphen . $dictionary[$units];
            }
            break;
        case $number < 1000:
            $hundreds  = intval($number / 100);
            $remainder = $number % 100;
            $string = $dictionary[$hundreds] . ' ' . $dictionary[100];
            if ($remainder) {
                $string .= $conjunction . convert_number_to_words($remainder);
            }
            break;

        default:
            $baseUnit = pow(1000, floor(log($number, 1000)));
            $numBaseUnits = (int) ($number / $baseUnit);
            $remainder = $number % $baseUnit;
            $string = convert_number_to_words($numBaseUnits) . ' ' . $dictionary[$baseUnit];
            if ($remainder) {
                $string .= $remainder < 100 ? $conjunction : $separator;
                $string .= convert_number_to_words($remainder);
            }
            break;
    }

    if (null !== $fraction && is_numeric($fraction)) {
        $string .= $decimal;
        $words = array();
        foreach (str_split((string) $fraction) as $number) {
            $words[] = $dictionary[$number];
        }
        $string .= implode(' ', $words);
    }

    return $string;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AQUAXA || Bill</title>
    <link rel="shortcut icon" href="./AQUAXA-logo.png" type="image/x-icon">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

        body {
            background-color: #ffe8d2;
            font-family: 'Montserrat', sans-serif
        }

        .card {
            border: none
        }

        .logo {
            background-color: #eeeeeea8
        }

        .totals tr td {
            font-size: 13px
        }

        .footer {
            background-color: #eeeeeea8
        }

        .footer span {
            font-size: 12px
        }

        .product-qty span {
            font-size: 12px;
            color: rgb(0, 0, 0)
        }
    </style>
</head>

<body>
    <div class="container mt-5 mb-5">
        <div class="row d-flex justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="text-center logo p-2 px-5"> <img src="./AQUAXA-logo.png" width="150"> </div>
                    <div class="text-center logo p-2 px-5">
                        <p>62 Mile, Manikpur, Jasidih B. Deoghar, Jharkhand<br> Website: aquaxa.in<br> Phone: +91 7903781156</p>
                    </div>
                    <div class="invoice p-5">
                        <!-- <h5>Your order Confirmed!</h5> -->
                        <div class=" border-bottom text-center d-flex flex-column align-items-center justify-content-center">
                            <span class="font-weight-bold d-block mt-4">Hello, <?php echo htmlspecialchars($customer_name); ?></span>
                            <span>Thank You For Your Purchase.</span>
                            <!-- <div class="payment border-top mt-3 mb-5 border-bottom table-responsive">
                                <?php foreach ($data1 as $row) : ?>
                                    <p>We are pleased to confirm your order no. #<?php echo $row['id']; ?> and a SMS has been sent on Phone No. <?php echo htmlspecialchars($phoneno); ?></p>
                                <?php endforeach; ?>
                            </div> -->
                        </div>
<br>
                        <?php
                        $subTotal = 0;
                        $sgst = 0;
                        $cgst = 0;
                        // $onbill_cdp = 0;
                        // $onbill_cdr = 0;
                        $totalRate = 0;
                        $totalTaxable = 0;
                        $onbill_cdp_amount = 0;

                        // Calculate subtotal, SGST, and CGST
                        foreach ($data1 as $row) {
                            $subTotal += $row['taxable'];

                            // Assuming GST is already provided as a percentage
                            $gst = $row['gst'];
                            // Divide GST by 2 to distribute it equally between SGST and CGST
                            $sgst += ($gst / 2) / 100 * $row['taxable'];
                            $cgst += ($gst / 2) / 100 * $row['taxable'];
                            $totalRate += $row['rate']; // Sum of all rates
                            $totalTaxable += $row['taxable']; // Sum of all taxable amounts
                        }

                        $total = $subTotal + $sgst + $cgst;
                        $totalSaving = ($total - $final_amount) + ($totalRate - $totalTaxable);
                        ?>
                        <div class="product border-bottom table-responsive">
                            <table class="table table-borderless">
                                <tbody>
                                    <h3>Order Details</h3>
                                    <?php
                                    $counter = 1; // Initialize counter
                                    foreach ($data1 as $item) :
                                    ?>
                                        <tr>
                                            <td width="20%" style="position: relative;">
                                                <img src="./aquaxa123.jpg" width="50" style="border-radius: 5px;">
                                                <div style="position: absolute; top: -0px; left: -0px; background-color:aqua; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                                    <?php echo $counter; ?>
                                                </div>
                                            </td>

                                            <td width="60%"><span class="font-weight-bold"><?php echo $item['item_name']; ?> (Validity : <?php echo $item['validity']; ?>) Days</span>
                                                <div class="product-qty"><span>Quantity: <?php echo $item['qty']; ?></span> <span>Person: <?php echo $row['no_of_person']; ?></span></div>
                                                <div class="product-qty"><span>Choose Date: <?php echo $item['issue_date']; ?></span></div>
                                            </td>
                                            <td width="20%">
                                                <div class="text-right"><span class="font-weight-bold">₹<?php echo $item['rate']; ?></span></div>
                                            </td>
                                        </tr>
                                    <?php
                                        $counter++; // Increment counter
                                    endforeach;
                                    ?>
                                </tbody>
                            </table>
                            <?php
                            if (!empty($item['coupon_no']) && is_array($item['coupon_no'])) {
                                echo 'Coupon No.: ' . implode(', ', $item['coupon_no']);
                            }
                            ?>
                        </div>
                        <div class="row d-flex justify-content-end">
                            <div class="col-md-5">
                                <table class="table table-borderless">
                                    <tbody class="totals">
                                        <!-- <tr>
                                            <td>Subtotal</td>
                                            <td class="text-right">₹<?php echo $subTotal; ?></td>
                                        </tr> -->
                                        <!-- <?php if ($gst > 0) : ?>
                                            <tr>
                                                <td>SGST (<?php echo $data1[0]['gst'] / 2; ?>%):</td>
                                                <td class="text-right">+<?php echo $sgst; ?></td>
                                            </tr>
                                            <tr>
                                                <td>CGST (<?php echo $data1[0]['gst'] / 2; ?>%):</td>
                                                <td class="text-right">+<?php echo $cgst; ?></td>
                                            </tr>
                                        <?php endif; ?> -->
                                        <tr class="border-top border-bottom">
                                            <td>Total</td>
                                            <td class="text-right font-weight-bold">₹ <?php echo $amount; ?></td>
                                        </tr>
                                        <tr class="border-top border-bottom">
                                            <td>Payment Mode</td>
                                            <td class="text-right font-weight-bold"><?php echo $payment_mode; ?></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <p>⚡ INFORMATION</p>
                        <p>* Coupon is valid after 15th May.</p>
                        <p>* Online bookings for the Water Park or Hotel Reservations cannot be modified or canceled once confirmed.</p>
                        <p>* Kindly ensure you carry your original and valid ID proof with you during your visit.</p>

                    </div>
                    <div class="d-flex justify-content-between footer p-3">
                        <span>Need Help? Visit our <a href="https://aquaxa.in/contact-us">help center</a></span>
                        <span id="currentDate"></span>

                        <script>
                            document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            });
                        </script>

                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>